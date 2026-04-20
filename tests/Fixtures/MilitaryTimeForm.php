<?php

namespace Cheesegrits\FilamentMilitaryTime\Tests\Fixtures;

use Cheesegrits\FilamentMilitaryTime\MilitaryTime;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Schemas\Schema;
use Livewire\Component;

class MilitaryTimeForm extends Component implements HasForms
{
    use InteractsWithForms;

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill();
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                MilitaryTime::make('time'),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $this->form->getState();
    }

    public function render(): string
    {
        return '<div></div>';
    }
}
