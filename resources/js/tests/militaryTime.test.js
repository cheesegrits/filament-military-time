import { describe, it, expect, beforeEach, vi } from 'vitest'
import militaryTimeInput from '../filament-military-time.js'

/**
 * Build an instance of the Alpine component with minimal stubs for DOM-dependent
 * properties ($refs, $nextTick, $watch). Tests that exercise pure logic (parsing,
 * formatting, validation) need no stubs; tests that exercise handleKeydown /
 * handlePaste need a stub $refs.input.
 */
function makeComponent(initialState = null) {
    const component = militaryTimeInput({ state: initialState })

    // Stub Alpine magic properties
    component.$refs = {
        input: {
            selectionStart: 0,
            selectionEnd: 0,
            setSelectionRange: vi.fn(),
        },
    }
    component.$nextTick = (fn) => fn()
    component.$watch = vi.fn()

    component.init()

    return component
}

// ---------------------------------------------------------------------------
// normalizeValue
// ---------------------------------------------------------------------------
describe('normalizeValue', () => {
    it('pads single-digit hour to two digits', () => {
        const c = makeComponent()
        expect(c.normalizeValue('9:05')).toBe('09:05')
    })

    it('leaves already-padded value unchanged', () => {
        const c = makeComponent()
        expect(c.normalizeValue('23:59')).toBe('23:59')
    })

    it('strips seconds component', () => {
        const c = makeComponent()
        expect(c.normalizeValue('12:30:45')).toBe('12:30')
    })

    it('returns empty string for null', () => {
        const c = makeComponent()
        expect(c.normalizeValue(null)).toBe('')
    })

    it('returns empty string for non-time string', () => {
        const c = makeComponent()
        expect(c.normalizeValue('abc')).toBe('')
    })

    it('returns empty string for empty string', () => {
        const c = makeComponent()
        expect(c.normalizeValue('')).toBe('')
    })
})

// ---------------------------------------------------------------------------
// isComplete
// ---------------------------------------------------------------------------
describe('isComplete', () => {
    it('returns true for a valid complete time', () => {
        const c = makeComponent()
        c.display = '14:30'
        expect(c.isComplete()).toBe(true)
    })

    it('returns false for partial input', () => {
        const c = makeComponent()
        c.display = '14:3'
        expect(c.isComplete()).toBe(false)
    })

    it('returns false for out-of-range time', () => {
        const c = makeComponent()
        c.display = '24:00'
        expect(c.isComplete()).toBe(false)
    })

    it('returns false for empty display', () => {
        const c = makeComponent()
        c.display = ''
        expect(c.isComplete()).toBe(false)
    })
})

// ---------------------------------------------------------------------------
// isValidTime
// ---------------------------------------------------------------------------
describe('isValidTime', () => {
    it.each([
        ['00', '00'],
        ['23', '59'],
        ['12', '30'],
    ])('returns true for %s:%s', (h, m) => {
        expect(makeComponent().isValidTime(h, m)).toBe(true)
    })

    it.each([
        ['24', '00'],
        ['00', '60'],
        ['99', '99'],
    ])('returns false for %s:%s', (h, m) => {
        expect(makeComponent().isValidTime(h, m)).toBe(false)
    })
})

// ---------------------------------------------------------------------------
// parseDigitsOnly
// ---------------------------------------------------------------------------
describe('parseDigitsOnly', () => {
    it('treats single digit as hour with zero minutes', () => {
        expect(makeComponent().parseDigitsOnly('5')).toEqual({ hours: '05', minutes: '00' })
    })

    it('treats two digits ≤ 23 as hours', () => {
        expect(makeComponent().parseDigitsOnly('23')).toEqual({ hours: '23', minutes: '00' })
    })

    it('treats two digits > 23 but ≤ 59 as minutes when positional is invalid', () => {
        // '29': positional would be '02':'90' (invalid), so falls through to minutes
        expect(makeComponent().parseDigitsOnly('29')).toEqual({ hours: '00', minutes: '29' })
    })

    it('uses positional split for two digits where tens digit is valid hour prefix', () => {
        // '34': 03:40 via positional (3→"03", 4→"40")
        expect(makeComponent().parseDigitsOnly('34')).toEqual({ hours: '03', minutes: '40' })
    })

    it('splits four digits as HH:MM', () => {
        expect(makeComponent().parseDigitsOnly('1430')).toEqual({ hours: '14', minutes: '30' })
    })

    it('returns null for more than four digits', () => {
        expect(makeComponent().parseDigitsOnly('14302')).toBeNull()
    })
})

// ---------------------------------------------------------------------------
// parseThreeDigits
// ---------------------------------------------------------------------------
describe('parseThreeDigits', () => {
    it('uses first two as hour when valid', () => {
        // '145': 14:50
        expect(makeComponent().parseThreeDigits('145')).toEqual({ hours: '14', minutes: '50' })
    })

    it('falls back to 0H:MM when first two digits are invalid hour', () => {
        // '259': first two '25' invalid hour → '02':'59'
        expect(makeComponent().parseThreeDigits('259')).toEqual({ hours: '02', minutes: '59' })
    })
})

// ---------------------------------------------------------------------------
// completeTime
// ---------------------------------------------------------------------------
describe('completeTime', () => {
    const c = makeComponent()

    it('returns null for empty input', () => {
        expect(c.completeTime('')).toBeNull()
    })

    it('returns null for null', () => {
        expect(c.completeTime(null)).toBeNull()
    })

    it('completes a single digit', () => {
        expect(c.completeTime('9')).toBe('09:00')
    })

    it('completes four raw digits', () => {
        expect(c.completeTime('1430')).toBe('14:30')
    })

    it('completes a partial colon input', () => {
        expect(c.completeTime('9:')).toBe('09:00')
    })

    it('accepts an already-complete time', () => {
        expect(c.completeTime('22:30')).toBe('22:30')
    })

    it('returns null for out-of-range digits that cannot be resolved', () => {
        // '9999': backtracking: 9999→999→99→9 → '09:00'? No — '99' > 59, '9' → 09:00
        // Actually '9' → valid. So let's test a truly unresolvable input.
        expect(c.completeTime('xyz')).toBeNull()
    })

    it('trims trailing invalid digits to find a valid time', () => {
        // '3456'→34:56 (34>23, invalid). '345'→parseThreeDigits: '34' invalid hour → '03:45'. Valid.
        expect(c.completeTime('3456')).toBe('03:45')
    })
})

// ---------------------------------------------------------------------------
// handleBlur
// ---------------------------------------------------------------------------
describe('handleBlur', () => {
    it('completes a partial display value on blur', () => {
        const c = makeComponent()
        c.display = '9'
        c.handleBlur()
        expect(c.display).toBe('09:00')
    })

    it('clears display when value cannot be completed', () => {
        const c = makeComponent()
        c.display = 'xyz'
        c.handleBlur()
        expect(c.display).toBe('')
    })

    it('syncs state to null when display is empty', () => {
        const c = makeComponent()
        c.display = ''
        c.state = '12:00'
        c.handleBlur()
        expect(c.state).toBeNull()
    })
})

// ---------------------------------------------------------------------------
// handlePaste
// ---------------------------------------------------------------------------
describe('handlePaste', () => {
    function makePasteEvent(text) {
        return {
            clipboardData: { getData: () => text },
        }
    }

    it('sets display from pasted valid time string', () => {
        const c = makeComponent()
        c.handlePaste(makePasteEvent('14:30'))
        expect(c.display).toBe('14:30')
        expect(c.state).toBe('14:30')
    })

    it('strips non-numeric non-colon characters from paste', () => {
        // Non-digit/non-colon chars are removed: '09:15 hrs' → '09:15'
        const c = makeComponent()
        c.handlePaste(makePasteEvent('09:15 hrs'))
        expect(c.display).toBe('09:15')
    })

    it('does nothing when pasted text cannot form a valid time', () => {
        const c = makeComponent()
        c.display = '12:00'
        c.handlePaste(makePasteEvent('xyz'))
        expect(c.display).toBe('12:00')
    })
})
