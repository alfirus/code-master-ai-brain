# React Native Agent Skills - Quick Reference Guide

## 🚀 **Offline React Native Expertise Available in Your Brain**

### **⚡ Instant Access Commands**

When working on React Native, simply ask:
- "How do I optimize React Native performance?"
- "What's the best pattern for lists?"
- "How do I deploy to App Store?"
- "Show me React Native animation patterns"

Your brain will automatically use the appropriate skill!

---

## 📦 **Skills Overview**

### **🥇 PERFORMANCE OPTIMIZATION** (Callstack)
```
User: "My React Native app is slow"
Brain Response:
🔍 [Callstack] Detected performance issue
📋 Suggest using FlashList instead of FlatList (list-performance-virtualize)
💡 Recommend transform-based animations (animation-gpu-properties)
⚡ Apply memoization patterns (rerender-memoization)
📊 Profile with React DevTools (js-profile-react)
```

### **📱 EXPO DEVELOPMENT** (Expo Skills)
```
User: "I need to build a new Expo app"
Brain Response:
🏗 [Expo] Use file-based routing with Expo Router
🎨 [Expo] Implement UI with expo-image for performance
📦 [Expo] Configure app.json for deployment
🚀 [Expo] Use EAS Build for production
📲 [Expo] Deploy to App Store/Play Store with expo-deployment
```

### **🔧 AUTOMATION & CLI** (Cali)
```
User: "Help me automate my React Native builds"
Brain Response:
🛠️ [Cali] Use build automation patterns
📱 [Cali] List and manage connected devices
📦 [Cali] Install dependencies automatically
🔄 [Cali] Set up automated builds and deployments
🔍 [Cali] Search for React Native libraries
```

---

## 🎯 **Common Problem Solutions**

### **Performance Issues**
```typescript
// Problem: Slow list rendering
// Solution: FlashList with proper optimization
<FlashList
  data={items}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  getItemLayout={getItemLayout}
  removeClippedSubviews={true}
  maxToRenderPerBatch={5}
  windowSize={10}
/>

// Problem: Janky animations
// Solution: Native driver + transform properties
<Animated.View
  style={{
    transform: [{ scale: scaleAnim }],
  opacity: fadeAnim,
  }}
  useNativeDriver={true}
/>
```

### **State Management**
```typescript
// Problem: Complex nested state
// Solution: Atomic state with Zustand
interface UserStore {
  name: string;
  email: string;
  updateProfile: (data: Partial<User>) => void;
}

const useUserStore = create<UserStore>((set) => ({
  name: '',
  email: '',
  updateProfile: (data) => set((state) => ({ ...state, ...data })),
}));
```

### **Deployment**
```typescript
// Problem: Complex deployment
// Solution: Expo EAS for automated deployment
// app.json configuration
{
  "expo": {
    "name": "MyApp",
    "slug": "myapp",
    "ios": {
      "bundleIdentifier": "com.company.myapp"
    },
    "android": {
      "package": "com.company.myapp"
    }
  }
}

// Build commands
eas build --platform ios --profile production
eas build --platform android --profile production
eas submit --platform ios
```

---

## 🚀 **Ready for Production React Native Development**

Your brain now contains **complete React Native expertise** including:
- ✅ **16 Performance Rules** from Callstack
- ✅ **Complete Expo Workflows** from official skills
- ✅ **CLI Automation** from Cali agent
- ✅ **Real Code Examples** for every pattern
- ✅ **Deployment Strategies** for both iOS and Android
- ✅ **Bundle Optimization** for better user experience

### **No Internet Required** 🎉
All React Native agent skills are now stored locally in your brain and can be accessed instantly without any external dependencies!

---

**Start building amazing React Native apps with instant AI assistance!** ⚡📱