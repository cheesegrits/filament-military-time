# A simple military (24 hour) time form component for Filament

[![Latest Version on Packagist](https://img.shields.io/packagist/v/cheesegrits/filament-military-time.svg?style=flat-square)](https://packagist.org/packages/cheesegrits/filament-military-time)
[![GitHub Tests Action Status](https://img.shields.io/github/actions/workflow/status/cheesegrits/filament-military-time/run-tests.yml?branch=main&label=tests&style=flat-square)](https://github.com/cheesegrits/filament-military-time/actions?query=workflow%3Arun-tests+branch%3Amain)
[![GitHub Code Style Action Status](https://img.shields.io/github/actions/workflow/status/cheesegrits/filament-military-time/fix-php-code-style-issues.yml?branch=main&label=code%20style&style=flat-square)](https://github.com/cheesegrits/filament-military-time/actions?query=workflow%3A"Fix+PHP+code+styling"+branch%3Amain)
[![Total Downloads](https://img.shields.io/packagist/dt/cheesegrits/filament-military-time.svg?style=flat-square)](https://packagist.org/packages/cheesegrits/filament-military-time)



A simple military (24 hour) time form component for Filament v4 and v5, that does not rely on the browser or system time locale.

## Installation

You can install the package via composer:

```bash
composer require cheesegrits/filament-military-time
```

## Usage

```php
use Cheesegrits\FilamentMilitaryTime\MilitaryTime;

MilitaryTime::make('time'),
```

## Testing

```bash
composer test
npm test
```

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Security Vulnerabilities

Please review [our security policy](.github/SECURITY.md) on how to report security vulnerabilities.

## Credits

- [Hugh Messenger](https://github.com/cheesegrits)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
