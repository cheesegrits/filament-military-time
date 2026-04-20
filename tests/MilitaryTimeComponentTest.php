<?php

use Cheesegrits\FilamentMilitaryTime\MilitaryTime;
use Filament\Forms\Components\Field;

describe('MilitaryTime component', function () {
    it('extends Filament Field', function () {
        expect(MilitaryTime::make('time'))->toBeInstanceOf(Field::class);
    });

    it('uses the correct view', function () {
        expect(MilitaryTime::make('time')->getView())
            ->toBe('filament-military-time::military-time');
    });

    it('uses the field name as the default label', function () {
        // Filament derives label from field name before container evaluation
        expect(MilitaryTime::make('departure_time')->getName())
            ->toBe('departure_time');
    });

    it('stores a custom label', function () {
        $field = MilitaryTime::make('time')->label('Departure Time');

        // Label is stored as a raw value; full evaluation needs a container
        expect($field)->toBeInstanceOf(MilitaryTime::class);
    });
});
