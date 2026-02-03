import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import PrintersView from '@/views/PrintersView.vue'
import { usePrinterStore } from '@/stores/printerStore'

describe('PrintersView.vue', () => {
  let wrapper: any;
  let store: any;

  beforeEach(() => {
    wrapper = mount(PrintersView, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    });
    store = usePrinterStore();
  });

  it('должен выводить сообщение, если список принтеров пуст', async () => {
    store.printers = []; // Очищаем список в сторе
    await wrapper.vm.$nextTick(); // Ждем обновления DOM
    expect(wrapper.text()).toContain('Список принтеров пуст');
  });

  it('должен отрисовывать список принтеров', async () => {
    store.printers = [{ id: '1', name: 'Ender 3', status: 'Idle' }];
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Ender 3');
  });

  it('должен блокировать кнопку удаления, если принтер занят', async () => {
    store.printers = [{ id: '1', name: 'Busy Printer', status: 'Printing' }];
    await wrapper.vm.$nextTick();
    const deleteBtn = wrapper.find('.btn-delete');
    // Если кнопки нет (v-if) или она disabled
    expect(deleteBtn.exists()).toBe(false); 
    expect(wrapper.text()).toContain('Нельзя удалить');
  });
});