---
name: banking-products-app testing setup
description: Test suite context for banking-products-app React Native/Expo project
type: project
---

Project at /home/agustinmites/sofka/App/banking-products-app.

Stack: React 19.1.0, Expo SDK 54, expo-router ~6.0.23, axios, react-native-svg 15.12.1.

Testing stack installed via package.json devDependencies:
- jest-expo ~54.0.0
- @testing-library/react-native ^12.5.0
- react-test-renderer 19.1.0

jest.config.js uses preset jest-expo with custom transformIgnorePatterns and moduleNameMapper for react-native-svg.

__mocks__/react-native-svg.js mocks SVG components as React Views/nulls.

Test files created:
- shared/lib/__tests__/productValidations.test.ts
- shared/ui/ProductItem/__tests__/ProductItem.test.tsx
- shared/ui/FormField/__tests__/FormField.test.tsx
- features/productSearch/__tests__/useProductSearch.test.ts
- features/productRegistration/__tests__/useProductRegistration.test.ts
- features/productDetail/__tests__/useProductDetail.test.ts
- features/productEdit/__tests__/useProductEdit.test.ts

**Why:** Initial test setup from scratch — no tests existed before.
**How to apply:** When adding new tests, follow the same __tests__ directory convention beside the source file, mock expo-router and productApi, never make real HTTP calls.
