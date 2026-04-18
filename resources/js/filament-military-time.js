export default function militaryTimeInput({ state }) {
    return {
        state,
        display: '',

        init() {
            this.display = this.normalizeValue(this.state)

            // Guard prevents infinite loop: state change → display update → sync → state change
            this.$watch('state', (value) => {
                const normalized = this.normalizeValue(value)
                if (normalized !== this.display) {
                    this.display = normalized
                }
            })
        },

        normalizeValue(value) {
            if (!value || typeof value !== 'string') return ''

            const match = value.match(/^(\d{1,2}):(\d{2})(:\d{2})?$/)
            if (!match) return ''

            return match[1].padStart(2, '0') + ':' + match[2]
        },

        hasSelection() {
            return (
                this.$refs.input.selectionStart !==
                this.$refs.input.selectionEnd
            )
        },

        isComplete() {
            return /^([01]\d|2[0-3]):[0-5]\d$/.test(this.display)
        },

        syncState() {
            const newState = this.isComplete() ? this.display : null
            if (this.state !== newState) {
                this.state = newState
            }
        },

        tryCompleteAndSync() {
            const completed = this.completeTime(this.display)
            if (completed) {
                this.display = completed
                this.syncState()
            }
        },

        moveCursorToEnd() {
            this.$nextTick(() => {
                const length = this.display.length
                this.$refs.input.setSelectionRange(length, length)
            })
        },

        isValidTime(hours, minutes) {
            const parsedHours = parseInt(hours)
            const parsedMinutes = parseInt(minutes)

            if (isNaN(parsedHours) || isNaN(parsedMinutes)) return false

            return parsedHours <= 23 && parsedMinutes <= 59
        },

        formatTime(hours, minutes) {
            return hours.padStart(2, '0') + ':' + minutes.padStart(2, '0')
        },

        completeTime(raw) {
            if (!raw) return null

            // Drop characters from the end until a valid time is found: "3456" → "345" → "03:45"
            for (let length = raw.length; length > 0; length--) {
                const attempt = raw.substring(0, length)
                const parsed = attempt.includes(':')
                    ? this.parseWithColon(attempt)
                    : this.parseDigitsOnly(attempt)

                if (parsed && this.isValidTime(parsed.hours, parsed.minutes)) {
                    return this.formatTime(parsed.hours, parsed.minutes)
                }
            }

            return null
        },

        parseWithColon(raw) {
            const [hoursRaw, minutesRaw] = raw.split(':')

            return {
                hours: (hoursRaw || '').padStart(2, '0'),
                minutes: (minutesRaw || '').padEnd(2, '0'),
            }
        },

        parseDigitsOnly(raw) {
            switch (raw.length) {
                case 1:
                    return { hours: '0' + raw, minutes: '00' }

                case 2:
                    return this.parseTwoDigits(raw)

                case 3:
                    return this.parseThreeDigits(raw)

                case 4:
                    return {
                        hours: raw.substring(0, 2),
                        minutes: raw.substring(2),
                    }

                default:
                    return null
            }
        },

        // Priority: "23" → 23:00 (whole as hours), "34" → 03:40 (digit-by-digit), "29" → 00:29 (whole as minutes)
        parseTwoDigits(raw) {
            const value = parseInt(raw)

            if (value <= 23) return { hours: raw, minutes: '00' }

            const positional = { hours: '0' + raw[0], minutes: raw[1] + '0' }
            if (this.isValidTime(positional.hours, positional.minutes))
                return positional

            if (value <= 59) return { hours: '00', minutes: raw }

            return null
        },

        parseThreeDigits(raw) {
            const firstTwoAsHours = raw.substring(0, 2)
            const lastOneAsMinutesTens = raw[2] + '0'

            if (this.isValidTime(firstTwoAsHours, lastOneAsMinutesTens)) {
                return { hours: firstTwoAsHours, minutes: lastOneAsMinutesTens }
            }

            return { hours: '0' + raw[0], minutes: raw.substring(1) }
        },

        handleKeydown(event) {
            if (event.ctrlKey || event.metaKey) return

            if (/^\d$/.test(event.key) || event.key === ':') {
                event.preventDefault()
                this.insertCharacter(event.key)
                return
            }

            if (event.key === 'Backspace' || event.key === 'Delete') {
                event.preventDefault()

                if (this.hasSelection()) {
                    const input = this.$refs.input
                    this.display =
                        this.display.substring(0, input.selectionStart) +
                        this.display.substring(input.selectionEnd)
                } else if (event.key === 'Delete') {
                    this.display = ''
                } else if (this.display.length > 0) {
                    this.display = this.display.slice(0, -1)
                }

                if (!this.display) {
                    this.syncState()
                }

                this.moveCursorToEnd()
                return
            }

            if (event.key.length === 1) {
                event.preventDefault()
            }
        },

        insertCharacter(char) {
            const input = this.$refs.input
            const before = this.display.substring(0, input.selectionStart)
            const after = this.display.substring(input.selectionEnd)

            this.display = before + char + after
            this.sanitizeDisplay()
            this.tryCompleteIfFull()
            this.moveCursorToEnd()
        },

        sanitizeDisplay() {
            const colonIndex = this.display.indexOf(':')

            if (colonIndex !== -1) {
                const before = this.display
                    .substring(0, colonIndex)
                    .replace(/\D/g, '')
                    .substring(0, 2)
                const after = this.display
                    .substring(colonIndex + 1)
                    .replace(/\D/g, '')
                    .substring(0, 2)

                this.display = before + ':' + after
            } else {
                this.display = this.display.replace(/\D/g, '').substring(0, 4)
            }
        },

        tryCompleteIfFull() {
            const colonIndex = this.display.indexOf(':')

            if (colonIndex !== -1) {
                const afterColon = this.display.substring(colonIndex + 1)

                if (afterColon.length === 2) {
                    this.tryCompleteAndSync()
                }
            } else if (this.display.length === 4) {
                this.tryCompleteAndSync()
            }
        },

        handlePaste(event) {
            const text = (event.clipboardData || window.clipboardData).getData(
                'text',
            )
            const cleaned = text.replace(/[^\d:]/g, '')
            const completed = this.completeTime(cleaned)

            if (completed) {
                this.display = completed
                this.syncState()
            }

            this.moveCursorToEnd()
        },

        handleBlur() {
            if (this.display) {
                this.display = this.completeTime(this.display) || ''
            }

            this.syncState()
        },
    }
}
