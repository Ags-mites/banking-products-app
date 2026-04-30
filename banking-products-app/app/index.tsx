// app/index.tsx — Redirige a la lista de productos
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/products" />;
}