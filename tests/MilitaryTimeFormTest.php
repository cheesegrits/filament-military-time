<?php

use Cheesegrits\FilamentMilitaryTime\Tests\Fixtures\MilitaryTimeForm;
use Livewire\Livewire;

describe('MilitaryTime form validation', function () {
    it('accepts valid military time', function (string $value) {
        Livewire::test(MilitaryTimeForm::class)
            ->set('data.time', $value)
            ->call('save')
            ->assertHasNoErrors('data.time');
    })->with([
        '00:00',
        '23:59',
        '12:30',
        '09:05',
    ]);

    it('rejects invalid military time', function (string $value) {
        Livewire::test(MilitaryTimeForm::class)
            ->set('data.time', $value)
            ->call('save')
            ->assertHasErrors(['data.time' => 'regex']);
    })->with([
        '24:00',
        '99:99',
        '1:30',
        'abc',
    ]);

    it('accepts null as empty/unset state', function () {
        Livewire::test(MilitaryTimeForm::class)
            ->set('data.time', null)
            ->call('save')
            ->assertHasNoErrors('data.time');
    });

    it('fills with an existing valid value', function () {
        Livewire::test(MilitaryTimeForm::class)
            ->set('data.time', '14:45')
            ->assertSet('data.time', '14:45');
    });
});
