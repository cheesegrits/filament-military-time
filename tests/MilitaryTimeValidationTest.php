<?php

const MILITARY_TIME_REGEX = '/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/';

describe('military time regex', function () {
    it('accepts valid HH:MM times', function (string $value) {
        expect($value)->toMatch(MILITARY_TIME_REGEX);
    })->with([
        'midnight' => '00:00',
        'end of day' => '23:59',
        'noon' => '12:00',
        'leading zero hour' => '09:05',
        'max hour' => '23:00',
        'max minute' => '00:59',
    ]);

    it('accepts valid HH:MM:SS times', function (string $value) {
        expect($value)->toMatch(MILITARY_TIME_REGEX);
    })->with([
        '00:00:00',
        '23:59:59',
        '12:30:45',
        '09:05:01',
    ]);

    it('rejects invalid times', function (string $value) {
        expect($value)->not->toMatch(MILITARY_TIME_REGEX);
    })->with([
        'hour too high' => '24:00',
        'minute too high' => '23:60',
        'both invalid' => '99:99',
        'missing leading zero hour' => '1:30',
        'missing leading zero minute' => '12:3',
        'letters' => 'ab:cd',
        'empty' => '',
        'no colon' => '1230',
        'single digit' => '5',
        'seconds out of range' => '12:30:60',
    ]);
});
