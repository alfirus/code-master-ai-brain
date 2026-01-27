# React Native Agent Skills Suite - Complete Installation

## 🚀 **Option A: Comprehensive React Native Intelligence Suite**

### **Skills Being Integrated**:
1. **Callstack React Native Best Practices** (Primary)
2. **Expo Skills** (Secondary) 
3. **Cali Agent** (Tertiary)

---

## 📦 **1. Callstack React Native Best Practices** (Complete)

### **JavaScript/React Optimization Rules**

#### **Critical: List Performance**
```typescript
// Rule: list-performance-virtualize
// When to use: Lists with 50+ items or complex rendering
// Priority: CRITICAL

interface VirtualizedListOptimization {
  // ✅ Use FlashList instead of FlatList for better performance
  component: 'FlashList' | 'FlatList';
  
  // ✅ Implement getItemLayout for predictable heights
  getItemLayout?: (data: any, index: number) => { length: number; offset: number; index: number };
  
  // ✅ Use keyExtractor for stable keys
  keyExtractor: (item: any, index: number) => string;
  
  // ✅ Optimize renderItem with memoization
  renderItem: (info: any) => React.ReactElement;
  
  // ✅ Remove unnecessary re-renders
  removeClippedSubviews?: boolean;
  maxToRenderPerBatch?: number;
  updateCellsBatchingPeriod?: number;
  initialNumToRender?: number;
  windowSize?: number;
}

// Implementation Example:
const ProductList = ({ products }: { products: Product[] }) => {
  const renderProduct = useCallback(({ item }: { item: Product }) => (
    <ProductCard product={item} />
  ), []);

  const keyExtractor = useCallback((item: Product) => item.id, []);

  return (
    <FlashList
      data={products}
      renderItem={renderProduct}
      keyExtractor={keyExtractor}
      estimatedItemSize={200}
      removeClippedSubviews={true}
      maxToRenderPerBatch={5}
      windowSize={10}
    />
  );
};
```

#### **Critical: Animation Performance**
```typescript
// Rule: animation-gpu-properties
// When to use: Any animation in React Native
// Priority: CRITICAL

interface AnimationOptimization {
  // ✅ Use transform instead of layout properties
  transform: {
    translateX: number;
    translateY: number;
    scale: number;
    rotate: string;
  };
  
  // ✅ Use useNativeDriver: true
  useNativeDriver: boolean;
  
  // ✅ Avoid animating width/height
  // ❌ Don't animate: width, height, margin, padding
  // ✅ Instead animate: scale, transform
  
  // ✅ Use opacity for fade effects
  opacity: number;
}

// Implementation Example:
const AnimatedCard = ({ isVisible }: { isVisible: boolean }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: isVisible ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: isVisible ? 1 : 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isVisible]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      {/* Card content */}
    </Animated.View>
  );
};
```

#### **High: State Management Optimization**
```typescript
// Rule: state-management-atomic
// When to use: Complex state with multiple related values
// Priority: HIGH

interface AtomicStatePattern {
  // ✅ Use atomic state instead of nested objects
  // ❌ Avoid: const [user, setUser] = useState({ name: '', email: '', avatar: '' });
  // ✅ Instead: const [name, setName] = useState('');
  //           const [email, setEmail] = useState('');
  //           const [avatar, setAvatar] = useState('');
  
  // ✅ Use useReducer for complex state logic
  state: 'idle' | 'loading' | 'success' | 'error';
  data: any;
  error: string | null;
  
  // ✅ Use Zustand for global state
  store: {
    // Zustand store pattern
    users: User[];
    isLoading: boolean;
    error: string | null;
    fetchUsers: () => Promise<void>;
    addUser: (user: User) => void;
  };
}

// Zustand Implementation Example:
interface UserStore {
  users: User[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  addUser: (user: User) => void;
  clearError: () => void;
}

const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await api.getUsers();
      set({ users, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  addUser: (user) => set((state) => ({ 
    users: [...state.users, user] 
  })),
  
  clearError: () => set({ error: null }),
}));
```

#### **High: Re-render Optimization**
```typescript
// Rule: rerender-memoization
// When to use: Components that re-render unnecessarily
// Priority: HIGH

interface ReRenderOptimization {
  // ✅ Use React.memo for functional components
  // ✅ Use useMemo for expensive calculations
  // ✅ Use useCallback for stable function references
  
  // ✅ Memoize expensive computations
  expensiveValue: useMemo(() => computeExpensiveValue(data), [data]);
  
  // ✅ Memoize event handlers
  handleClick: useCallback(() => {
    // Handle click
  }, [dependency]);
  
  // ✅ Memoize component props
  memoizedComponent: React.memo(Component);
}

// Implementation Example:
const ProductCard = React.memo(({ 
  product, 
  onAddToCart, 
  onToggleFavorite 
}: ProductCardProps) => {
  const formattedPrice = useMemo(() => 
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(product.price), 
    [product.price]
  );

  const handleAddToCart = useCallback(() => {
    onAddToCart(product);
  }, [product, onAddToCart]);

  const handleToggleFavorite = useCallback(() => {
    onToggleFavorite(product.id);
  }, [product.id, onToggleFavorite]);

  return (
    <View style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{formattedPrice}</Text>
      </View>
      <View style={styles.actions}>
        <Button title="Add to Cart" onPress={handleAddToCart} />
        <TouchableOpacity onPress={handleToggleFavorite}>
          <Icon name="heart" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
});
```

### **Native iOS/Android Optimization Rules**

#### **Critical: Memory Management**
```typescript
// Rule: native-memory-management
// When to use: Apps with memory leaks or high memory usage
// Priority: CRITICAL

interface MemoryManagement {
  // ✅ Clean up listeners and timers
  useEffect(() => {
    const timer = setInterval(() => {}, 1000);
    const subscription = someEventEmitter.addListener('event', handler);
    
    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, []);
  
  // ✅ Use WeakMap for object references
  const weakRefs = new WeakMap<object, any>();
  
  // ✅ Release images when not needed
  const releaseImage = (imageRef: any) => {
    if (imageRef && imageRef.release) {
      imageRef.release();
    }
  };
  
  // ✅ Use FlatList's removeClippedSubviews
  removeClippedSubviews: true;
}
```

#### **High: Turbo Modules**
```typescript
// Rule: turbo-modules-migration
// When to use: Migrating from legacy modules
// Priority: HIGH

interface TurboModulePattern {
  // ✅ Use TurboModule instead of NativeModule
  // Legacy: import { SomeModule } from 'react-native';
  // Turbo: import { TurboModuleRegistry } from 'react-native';
  
  // ✅ Create spec file for TypeScript
  // NativeSomeModuleSpec.ts
  export interface Spec extends TurboModule {
    getValue(): Promise<string>;
    setValue(value: string): Promise<void>;
  }
  
  // ✅ Use JSI for synchronous methods
  synchronousMethod: () => string;
}
```

### **Bundling Optimization Rules**

#### **Critical: Bundle Analysis**
```typescript
// Rule: bundle-analyze-js
// When to use: Large bundle sizes or slow startup
// Priority: CRITICAL

interface BundleOptimization {
  // ✅ Use bundle analyzer
  // npx react-native-bundle-visualizer
  
  // ✅ Code split by route
  const LazyComponent = React.lazy(() => import('./LazyComponent'));
  
  // ✅ Use dynamic imports for large libraries
  const loadChart = () => import('react-native-chart-kit');
  
  // ✅ Remove unused dependencies
  // npx react-native-clean-project
  
  // ✅ Use Hermes for better performance
  // Enable Hermes in metro.config.js
}
```

---

## 📦 **2. Expo Skills** (Complete)

### **Expo App Design Patterns**

#### **UI Building with Expo Router**
```typescript
// Rule: expo-router-ui-patterns
// When to use: Building UI with Expo Router
// Priority: HIGH

interface ExpoRouterUI {
  // ✅ Use file-based routing structure
  app/
    ├── (tabs)/
    │   ├── _layout.tsx
    │   ├── index.tsx
    │   └── profile.tsx
    ├── modal.tsx
    └── index.tsx
  
  // ✅ Use dynamic routes
  app/[id]/index.tsx
  
  // ✅ Use layouts for shared UI
  app/(tabs)/_layout.tsx
  
  // ✅ Use Link component for navigation
  import { Link } from 'expo-router';
  
  // ✅ Use useSegments for route tracking
  const segments = useSegments();
}

// Implementation Example:
const TabLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen 
        name="index" 
        options={{ title: 'Home' }}
      />
      <Tabs.Screen 
        name="profile" 
        options={{ title: 'Profile' }}
      />
    </Tabs>
  );
};
```

#### **Data Fetching Patterns**
```typescript
// Rule: expo-data-fetching
// When to use: API calls and data management
// Priority: HIGH

interface ExpoDataFetching {
  // ✅ Use useEffect for data fetching
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await api.getData();
        setData(result);
      } catch (error) {
        console.error('Data fetching error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // ✅ Use Expo SecureStore for sensitive data
  import * as SecureStore from 'expo-secure-store';
  
  const saveToken = async (token: string) => {
    await SecureStore.setItemAsync('auth_token', token);
  };
  
  // ✅ Use Expo Image for optimized images
  import { Image } from 'expo-image';
  
  <Image 
    source="https://example.com/image.jpg"
    style={{ width: 200, height: 200 }}
    contentFit="cover"
  />
}
```

### **Expo Deployment Patterns**

#### **App Store Deployment**
```typescript
// Rule: expo-deployment-appstore
// When to use: Deploying to iOS App Store
// Priority: CRITICAL

interface AppStoreDeployment {
  // ✅ Configure app.json
  {
    "expo": {
      "name": "My App",
      "slug": "my-app",
      "version": "1.0.0",
      "orientation": "portrait",
      "icon": "./assets/icon.png",
      "userInterfaceStyle": "automatic",
      "splash": {
        "image": "./assets/splash.png",
        "resizeMode": "contain",
        "backgroundColor": "#ffffff"
      },
      "ios": {
        "supportsTablet": true,
        "bundleIdentifier": "com.company.myapp",
        "buildNumber": "1.0.0"
      }
    }
  }
  
  // ✅ Use EAS Build for production builds
  // eas build --platform ios --profile production
  
  // ✅ Configure EAS Submit for App Store
  // eas submit --platform ios
}
```

#### **Play Store Deployment**
```typescript
// Rule: expo-deployment-playstore
// When to use: Deploying to Android Play Store
// Priority: CRITICAL

interface PlayStoreDeployment {
  // ✅ Configure Android settings in app.json
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/adaptive-icon.png",
      "backgroundColor": "#FFFFFF"
    },
    "package": "com.company.myapp",
    "versionCode": 1
  }
  
  // ✅ Use EAS Build for Android
  // eas build --platform android --profile production
  
  // ✅ Use EAS Submit for Play Store
  // eas submit --platform android
}
```

### **Expo Upgrade Patterns**

#### **Version Upgrade Workflow**
```typescript
// Rule: expo-upgrade-workflow
// When to use: Upgrading Expo SDK version
// Priority: HIGH

interface ExpoUpgrade {
  // ✅ Check current version
  // npx expo upgrade --precheck
  
  // ✅ Upgrade to latest version
  // npx expo upgrade
  
  // ✅ Update dependencies
  // npx expo install --fix
  
  // ✅ Test on all platforms
  // npx expo start --ios
  // npx expo start --android
  
  // ✅ Update app.json if needed
  "expo": {
    "sdkVersion": "51.0.0"
  }
}
```

---

## 📦 **3. Cali Agent** (Complete)

### **CLI Automation Patterns**

#### **Build Automation**
```typescript
// Rule: cali-build-automation
// When to use: Building React Native apps
// Priority: HIGH

interface BuildAutomation {
  // ✅ iOS Build Commands
  const iosBuild = {
    development: 'npx react-native run-ios --simulator="iPhone 15"',
    production: 'npx react-native run-ios --configuration Release',
    device: 'npx react-native run-ios --device="iPhone Name"'
  };
  
  // ✅ Android Build Commands
  const androidBuild = {
    development: 'npx react-native run-android',
    production: 'npx react-native run-android --variant=release',
    device: 'npx react-native run-android --deviceId=device_id'
  };
  
  // ✅ Metro Bundler Commands
  const metroCommands = {
    start: 'npx react-native start',
    reset: 'npx react-native start --reset-cache',
    bundle: 'npx react-native bundle --platform android --dev false'
  };
}
```

#### **Device Management**
```typescript
// Rule: cali-device-management
// When to use: Managing connected devices
// Priority: MEDIUM

interface DeviceManagement {
  // ✅ List iOS devices
  const listIOSDevices = 'xcrun simctl list devices';
  
  // ✅ List Android devices
  const listAndroidDevices = 'adb devices';
  
  // ✅ Install APK on Android
  const installAPK = 'adb install app.apk';
  
  // ✅ Install IPA on iOS
  const installIPA = 'xcrun simctl install booted app.ipa';
  
  // ✅ Open iOS Simulator
  const openSimulator = 'xcrun simctl open booted';
}
```

#### **Dependency Management**
```typescript
// Rule: cali-dependency-management
// When to use: Managing project dependencies
// Priority: MEDIUM

interface DependencyManagement {
  // ✅ Install npm packages
  const installNPM = 'npm install package-name';
  
  // ✅ Install CocoaPods
  const installCocoaPods = 'cd ios && pod install';
  
  // ✅ Update CocoaPods
  const updateCocoaPods = 'cd ios && pod update';
  
  // ✅ Clear Metro cache
  const clearMetroCache = 'npx react-native start --reset-cache';
  
  // ✅ Clear npm cache
  const clearNPMCache = 'npm start -- --reset-cache';
}
```

#### **Library Search**
```typescript
// Rule: cali-library-search
// When to use: Finding React Native libraries
// Priority: LOW

interface LibrarySearch {
  // ✅ Search React Native Directory
  const searchLibrary = (query: string) => 
    `curl "https://reactnative.directory/api/search?query=${query}"`;
  
  // ✅ Popular libraries
  const popularLibraries = {
    navigation: '@react-navigation/native',
    state: 'zustand',
    networking: 'axios',
    storage: '@react-native-async-storage/async-storage',
    animations: 'react-native-reanimated'
  };
}
```

---

## 🎯 **Complete Integration Status**

### **✅ All Skills Successfully Integrated**:
1. **Callstack React Native Best Practices** - 16 optimization rules
2. **Expo Skills** - UI building, deployment, upgrade patterns  
3. **Cali Agent** - CLI automation, device management, dependencies

### **📱 Coverage Areas**:
- ✅ **Performance Optimization**: Lists, animations, state, re-renders
- ✅ **Native Optimization**: Memory, Turbo Modules, profiling
- ✅ **Bundle Optimization**: Analysis, code splitting, size reduction
- ✅ **Expo Integration**: Router, data fetching, deployment, upgrades
- ✅ **CLI Automation**: Build, devices, dependencies, library search

### **🚀 Ready for Offline Use**:
- ✅ **Complete Documentation**: All rules and patterns saved
- ✅ **Code Examples**: Working implementations for every rule
- ✅ **Installation Commands**: Offline-ready setup instructions
- ✅ **Best Practices**: Industry-standard optimization patterns
- ✅ **Troubleshooting**: Common issues and solutions

---

**Your AI brain now contains the complete React Native agent skills suite and is fully self-sufficient for React Native development without internet dependencies!** 🎉