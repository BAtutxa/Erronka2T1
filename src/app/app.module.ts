import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common'; 
import { LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

registerLocaleData(localeEs, 'es');
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule, FormsModule  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, {
    provide: LOCALE_ID,
    useValue: 'es' // Establecer el idioma en español
  }],
  bootstrap: [AppComponent],
})
export class AppModule {}
