import { TestBed } from '@angular/core/testing';
import { NotesService } from './notes.service';
import { SettingsService } from './settings.service';

describe('NotesService', () => {
  let service: NotesService;
  let settings: SettingsService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotesService);
    settings = TestBed.inject(SettingsService);
  });

  it('deve começar com as notas de exemplo', () => {
    expect(service.notes().length).toBeGreaterThan(0);
  });

  it('deve filtrar por texto em título, conteúdo e tags', () => {
    service.setQuery('docker');
    expect(service.filtered().length).toBe(1);
    expect(service.filtered()[0].title).toContain('Docker');
  });

  it('deve filtrar por tag ativa', () => {
    service.setTag('angular');
    expect(service.filtered().every((n) => n.tags.includes('angular'))).toBe(true);
  });

  it('deve criar uma nota com id gerado', () => {
    const before = service.notes().length;
    const note = service.create({
      title: 'Nova',
      content: 'Conteúdo',
      tags: ['teste'],
      color: 'blue',
      pinned: false,
    });
    expect(service.notes().length).toBe(before + 1);
    expect(note.id).toContain('n-');
  });

  it('deve alternar a fixação', () => {
    const note = service.notes()[0];
    const before = note.pinned;
    service.togglePinned(note.id);
    expect(service.getById(note.id)?.pinned).toBe(!before);
  });

  it('deve alternar o favorito adicionando e removendo a tag', () => {
    const note = service.notes()[0];
    service.toggleFavorite(note.id);
    expect(service.getById(note.id)?.tags).toContain('favorito');
    service.toggleFavorite(note.id);
    expect(service.getById(note.id)?.tags).not.toContain('favorito');
  });

  it('deve remover uma nota', () => {
    const note = service.notes()[0];
    service.remove(note.id);
    expect(service.getById(note.id)).toBeUndefined();
  });

  it('deve paginar os resultados', () => {
    settings.setPageSize(3);
    expect(service.paged().length).toBeLessThanOrEqual(3);
    expect(service.totalPages()).toBeGreaterThan(1);
  });
});