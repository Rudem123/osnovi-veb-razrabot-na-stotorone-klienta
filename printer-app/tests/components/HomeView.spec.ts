import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import HomeView from '@/views/HomeView.vue'
import { usePrinterStore } from '@/stores/printerStore'

describe('HomeView.vue', () => {
  it('должен отображать процент готовности при печати', async () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [createTestingPinia({
          initialState: {
            printerStore: {
              printers: [{ id: '1', name: 'Prusa', status: 'Printing', progress: 45 }],
              plastics: [],
              models: []
            }
          }
        })],
      },
    });

    expect(wrapper.text()).toContain('45%');
    const progressBar = wrapper.find('.bar');
    expect(progressBar.attributes('style')).toContain('width: 45%');
  });

  it('должен отображать сообщение об ошибке, если принтер сломался', async () => {
     const wrapper = mount(HomeView, {
      global: {
        plugins: [createTestingPinia({
          initialState: {
            printerStore: {
              printers: [{ id: '1', name: 'Prusa', status: 'Error', errorMessage: 'Перегрев' }],
              plastics: [],
              models: []
            }
          }
        })],
      },
    });
    expect(wrapper.text()).toContain('Перегрев');
  });
});