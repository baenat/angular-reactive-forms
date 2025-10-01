import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { JsonPipe } from '@angular/common';
import { Country } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-country-page',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './country-page.component.html',
})
export class CountryPageComponent {

  private formBuilder = inject(FormBuilder);
  countryServices = inject(CountryService);

  formCountry = this.renderForm();

  regions = signal(this.countryServices.regions);
  countries = signal<Country[]>([]);
  borders = signal<Country[]>([]);

  renderForm() {
    return this.formBuilder.group({
      region: ['', Validators.required],
      country: ['', Validators.required],
      border: ['', Validators.required],
    });
  }

  onFormChange = effect((onCleanup) => {
    const regionSubscription = this.onRegionChanged();
    const countrySubscription = this.onCountryChanged();

    onCleanup(() => {
      regionSubscription?.unsubscribe();
      countrySubscription?.unsubscribe();
    })
  });

  onRegionChanged() {
    return this.formCountry.get('region')?.valueChanges
      .pipe(
        tap(() => this.clearFormChangedRegion()),
        filter((region) => !!region),
        switchMap((region) => this.countryServices.getCountriesByRegion(region ?? ''))
      ).subscribe((countries) => {
        this.countries.set(countries);
      });
  }

  onCountryChanged() {
    return this.formCountry.get('country')?.valueChanges
      .pipe(
        tap(() => this.clearFormChangedCountry()),
        filter((country) => !!country),
        switchMap((alphaCode) => this.countryServices.getCountryByAlphaCode(alphaCode ?? '')),
        switchMap((country) => this.countryServices.getCountryBordersByCode(country.borders)),
      ).subscribe((countries) => {
        console.log(countries);
        this.borders.set(countries);
      });
  }

  clearFormChangedRegion() {
    this.formCountry.get('country')?.setValue('');
    this.formCountry.get('border')?.setValue('');

    this.countries.set([]);
    this.borders.set([]);
  }

  clearFormChangedCountry() {
    this.formCountry.get('border')?.setValue('');
    this.borders.set([]);
  }
}
