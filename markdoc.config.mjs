import { defineMarkdocConfig, component } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
  tags: {
    // Регистрируем тег 'product-card'.
    // Важно: Keystatic сохраняет блоки как {% product-card ... %}, поэтому ключ должен быть через дефис.
    'product-card': {
      // Указываем путь к компоненту, который будет отрисовывать этот блок
      // Убедитесь, что этот файл существует!
      render: component('./src/components/widgets/ProductWidget.astro'),
      
      attributes: {
        // Разрешаем атрибут 'item', в который Keystatic пишет slug товара
        item: { 
          type: String, 
          required: true 
        },
      },
    },
  },
});