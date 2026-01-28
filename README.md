# ¿Qué comemos hoy?

Una app MVP de ruleta de comidas construida con React Native y Expo.

## 🚀 Comenzar

### Prerequisitos

- Node.js (v16 o superior)
- Expo Go app en tu dispositivo móvil ([iOS](https://apps.apple.com/app/apple-store/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Instalación y ejecución

```bash
# Instalar dependencias (ya hecho)
npm install

# Iniciar el servidor de desarrollo
npx expo start
```

Escanea el código QR con:
- **iOS**: Cámara nativa
- **Android**: App Expo Go

## 📱 Funcionalidades

### Pantallas

1. **SplashScreen**: Pantalla de bienvenida con animación
2. **HomeScreen**: Ruleta principal con giros diarios
3. **EditFoodsScreen**: Gestionar comidas (agregar/eliminar)
4. **ResultScreen**: Muestra la comida seleccionada
5. **RecipeDetailScreen**: Receta detallada con ingredientes y pasos

### Características principales

- ✅ **Ruleta animada** con 10 comidas predeterminadas argentinas
- ✅ **2 giros gratis por día** (reseteo automático diario)
- ✅ **Agregar comidas personalizadas** (máx. 20 caracteres)
- ✅ **Eliminar comidas personalizadas** (las predeterminadas están bloqueadas)
- ✅ **Recetas integradas** para la mayoría de comidas predeterminadas
- ✅ **Persistencia local** con AsyncStorage
- ✅ **Animaciones fluidas** (botones, transiciones, ruleta)
- ✅ **Tema personalizado** (colores argentinos: celeste y dorado)
- ✅ **Placeholder de publicidad** para 3er giro (AdMob pendiente)

## 🎨 Diseño

### Paleta de colores

- **Primary (Celeste)**: `#4D96FF`
- **Accent (Gold)**: `#F9C74F`
- **Background**: `#FFFFFF`
- **Text**: `#111827`
- **Muted**: `#E5E7EB`

### Iconos

MaterialCommunityIcons de `@expo/vector-icons`

## 🗂️ Estructura del proyecto

```
src/
├── components/       # Componentes reutilizables
│   ├── PrimaryButton.tsx
│   ├── Card.tsx
│   ├── Header.tsx
│   ├── LoadingIndicator.tsx
│   ├── RouletteWheel.tsx
│   └── AdGateModal.tsx
├── data/            # Datos estáticos (comidas predeterminadas)
│   └── foods.ts
├── navigation/      # Configuración de navegación
│   └── AppNavigator.tsx
├── screens/         # Pantallas de la app
│   ├── SplashScreen.tsx
│   ├── HomeScreen.tsx
│   ├── EditFoodsScreen.tsx
│   ├── ResultScreen.tsx
│   └── RecipeDetailScreen.tsx
├── storage/         # Helpers de AsyncStorage
│   └── storage.ts
├── theme/           # Sistema de tema (colores, tipografía)
│   └── index.ts
├── types/           # Definiciones TypeScript
│   └── index.ts
└── utils/           # Utilidades (fechas)
    └── dateUtils.ts
```

## 🍽️ Comidas predeterminadas

1. Hamburguesas 🍔
2. Empanadas 🥟
3. Pasta 🍝
4. Pizza 🍕
5. Guiso 🍲
6. Tarta 🥧
7. Polenta 🍚
8. Sushi 🍱
9. Tacos 🌮
10. Milanesa 🍗

## 🔄 Lógica de giros

- **Gratis**: 2 giros/día
- **Reset**: A medianoche (timezone local)
- **3er giro**: Muestra modal de publicidad (placeholder)

## 🚧 TODOs / Futuras mejoras

- [ ] Integrar AdMob para giros adicionales
- [ ] Agregar animación SVG para la ruleta (más realista)
- [ ] Permitir editar recetas
- [ ] Agregar selector de colores para comidas personalizadas
- [ ] Modo premium (giros ilimitados)
- [ ] Compartir resultado en redes sociales
- [ ] Historial de comidas seleccionadas
- [ ] Notificaciones push ("¿Ya decidiste qué comer?")

## 📦 Dependencias principales

- `expo` - SDK de Expo
- `react-native` - Framework
- `@react-navigation/native` - Navegación
- `@react-navigation/native-stack` - Stack navigator
- `@react-native-async-storage/async-storage` - Persistencia local
- `@expo/vector-icons` - Iconos (MaterialCommunityIcons)
- `react-native-screens` - Optimización de navegación
- `react-native-safe-area-context` - Safe areas

## 📄 Licencia

Proyecto MVP para uso personal.

---

**¡A cocinar!** 🇦🇷👨‍🍳
# Que-Comemos-Hoy
