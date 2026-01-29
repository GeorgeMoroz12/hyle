import { defineMarkdocConfig, component } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
  tags: {
    // ИСПРАВЛЕНО: Ключ должен быть camelCase ('productCard'), 
    // потому что именно так Keystatic сохраняет его в файл.
    productCard: {
      render: component('./src/components/widgets/ProductWidget.astro'),
      attributes: {
        item: { type: String, required: true },
      },
    },
  },
});