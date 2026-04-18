<?php

namespace Cheesegrits\FilamentMilitaryTime;

use Filament\Forms\Components\Field;

class MilitaryTime extends Field
{
    protected string $view = 'filament-military-time::military-time';

    protected function setUp(): void
    {
        parent::setUp();

        $this->regex('/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/');
    }
}
