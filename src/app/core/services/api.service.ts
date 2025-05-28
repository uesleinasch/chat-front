import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private httpClient = inject(HttpClient);
  private baseUrl = ''; // URL base será configurada conforme necessidade

  /**
   * Envia dados via POST para um endpoint específico
   * @param endpointUrl URL do endpoint (pode ser relativa ou absoluta)
   * @param payload Dados a serem enviados
   * @returns Observable com a resposta da API
   */
  sendData(endpointUrl: string, payload: any): Observable<any> {
    const fullUrl = this.buildFullUrl(endpointUrl);
    
    return this.httpClient.post(fullUrl, payload)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Envia dados com fotos via POST usando FormData
   * @param endpointUrl URL do endpoint (pode ser relativa ou absoluta)
   * @param payload Dados JSON a serem enviados
   * @param photos Array de arquivos de imagem
   * @returns Observable com a resposta da API
   */
  sendDataWithPhotos(endpointUrl: string, payload: any, photos: File[]): Observable<any> {
    const fullUrl = this.buildFullUrl(endpointUrl);
    const formData = new FormData();

    // Adiciona os dados JSON ao FormData
    Object.keys(payload).forEach(key => {
      if (payload[key] !== null && payload[key] !== undefined) {
        // Se o valor é um objeto, converte para JSON string
        const value = typeof payload[key] === 'object' 
          ? JSON.stringify(payload[key]) 
          : payload[key];
        formData.append(key, value);
      }
    });

    // Adiciona as fotos ao FormData
    photos.forEach((photo, index) => {
      formData.append(`photos`, photo, photo.name);
    });

    return this.httpClient.post(fullUrl, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Método genérico para requisições POST que detecta automaticamente se deve usar FormData
   * @param endpointUrl URL do endpoint
   * @param payload Dados a serem enviados
   * @param photos Array opcional de arquivos de imagem
   * @returns Observable com a resposta da API
   */
  postData(endpointUrl: string, payload: any, photos?: File[]): Observable<any> {
    if (photos && photos.length > 0) {
      return this.sendDataWithPhotos(endpointUrl, payload, photos);
    }
    return this.sendData(endpointUrl, payload);
  }

  /**
   * Define a URL base da API
   * @param baseUrl Nova URL base
   */
  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  /**
   * Constrói a URL completa a partir do endpoint
   * @param endpointUrl URL do endpoint
   * @returns URL completa
   */
  private buildFullUrl(endpointUrl: string): string {
    // Se a URL já é absoluta (contém protocolo), usa ela diretamente
    if (endpointUrl.startsWith('http://') || endpointUrl.startsWith('https://')) {
      return endpointUrl;
    }

    // Se não há base URL definida, usa o endpoint como está
    if (!this.baseUrl) {
      return endpointUrl;
    }

    // Remove barra inicial se existir para evitar duplicação
    const cleanEndpoint = endpointUrl.startsWith('/') 
      ? endpointUrl.substring(1) 
      : endpointUrl;

    // Combina base URL com endpoint
    const baseUrlWithSlash = this.baseUrl.endsWith('/') 
      ? this.baseUrl 
      : `${this.baseUrl}/`;

    return `${baseUrlWithSlash}${cleanEndpoint}`;
  }

  /**
   * Trata erros das requisições HTTP
   * @param error Erro da requisição
   * @returns Observable com erro tratado
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Erro desconhecido';

    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro do cliente: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      errorMessage = `Erro do servidor: ${error.status} - ${error.message}`;
      
      // Se há uma mensagem específica da API, usa ela
      if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }

    console.error('ApiService Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
