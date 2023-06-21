import { Component, ElementRef, ViewChild } from '@angular/core';
import { GifsService } from '../../servives/gifs.service';

@Component({
  selector: 'gifs-search-box',
  template: `
    <h5>Buscar:</h5>
    <input
      class="form-control"
      placeholder="Buscar gifs..."
      (keyup.enter)="searchTag()"
      #txtTagInput
    />
  `,
})
export class SearchBoxComponent {
  // Sirve para tomar una referencia local
  @ViewChild('txtTagInput')
  public tagInput!: ElementRef<HTMLInputElement>;

  // Inyectamos el servicio GifsService
  constructor(private gifsService: GifsService) {}

  searchTag() {
    // Accedemos al valor del input
    const newTag = this.tagInput.nativeElement.value;

    // Utilizamos el método del servicio
    this.gifsService.searchTag(newTag);

    // Reseteamos el input
    this.tagInput.nativeElement.value = '';
  }
}

/**
 * NOTA:
 * - @ViewChild -> sirve para tener una referencia de un elemento HTML y acceder a su valor. Me recuerda al useRef().
 */
