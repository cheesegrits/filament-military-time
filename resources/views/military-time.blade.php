@php
    $fieldWrapperView = $getFieldWrapperView();
    $id = $getId();
    $isDisabled = $isDisabled();
    $statePath = $getStatePath();
@endphp

<x-dynamic-component
        :component="$fieldWrapperView"
        :field="$field"
>
    <x-filament::input.wrapper
            :disabled="$isDisabled"
            :valid="! $errors->has($statePath)"
    >
        <div
                x-load
                x-load-src="{{ \Filament\Support\Facades\FilamentAsset::getAlpineComponentSrc('filament-military-time', 'cheesegrits/filament-military-time') }}"
                x-data="militaryTimeInput({
                state: $wire.{{ $applyStateBindingModifiers("\$entangle('{$statePath}')") }},
            })"
                wire:ignore
                class="flex-1"
        >
            <input
                    x-ref="input"
                    :value="display"
                    x-on:keydown="handleKeydown($event)"
                    x-on:paste.prevent="handlePaste($event)"
                    x-on:blur="handleBlur()"
                    x-on:focus="moveCursorToEnd()"
                    type="text"
                    inputmode="numeric"
                    placeholder="22:30"
                    autocomplete="off"
                    maxlength="5"
                    @disabled($isDisabled)
                    id="{{ $id }}"
                    class="fi-input"
            />
        </div>
    </x-filament::input.wrapper>
</x-dynamic-component>
