import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Component } from '@angular/core';
import { AppModule } from './app.module';

//enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule);
