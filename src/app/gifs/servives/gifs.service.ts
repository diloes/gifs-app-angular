import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({ providedIn: 'root' })
export class GifsService {
  public gifsList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey: string = 'M9B1VJcRR82wFX8sak3FxrmuaxZoZPpJ';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizedHistory(tag: string) {
    tag = tag?.toLowerCase().trim();

    // Comprobamos que no se repitan los tags
    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }

    // Añadimos el tag al inicio del array
    this._tagsHistory.unshift(tag);

    // Sólo vamos a permitir que haya 10
    this._tagsHistory = this.tagsHistory.splice(0, 10);

    // Lo guardamos en localStorage
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    if (!localStorage.getItem('history')) return;
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);
    if (localStorage.getItem('history')?.length === 0) return;
    this.searchTag(this._tagsHistory[0]);
  }

  resetTagsHistory(): void {
    this._tagsHistory = [];
    localStorage.clear();
    this.gifsList = [];
  }

  searchTag(tag: string): void {
    if (tag?.length === 0) return;
    this.organizedHistory(tag);

    // Esto es propio de JS
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', tag);

    // Esto es un Observable, no es una promesa.
    this.http
      .get<SearchResponse>(`${this.serviceUrl}/search`, { params })
      .subscribe((resp) => {
        this.gifsList = resp.data;
      });
  }
}

/**
 * NOTAS:
 * - Para tener mayor control y seguridad creamos las propiedades como privadas y accedemos a ellas con getters, incluso
 * trabajando con una copia dentro del get. Lo del guión bajo al inicio es para que se sepa que es una propiedad privada.
 * - provideIn: root -> hace que el servicio este disponible en tooooda la aplicación y todos los módulos que inyecten
 * ese servicio. Si no, habría que andar importandolo y exportándolo por los módulos correspondientes.
 * - El Pipe que estamos usando en sidebar component nos pone la primera letra en mayuscula en los elemntos del arary. Pero
 * eso es sólo visual, no cambia nada en el array. Por eso aquí usamos toLowerCase() y no afecta en nada al html.
 */
