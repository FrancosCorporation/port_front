import Card from "../../components/render/Card";
import "./Dashboard2.css";

export default function Dashboard() {
 
  return (
    <div style={{display:'flex', gap:'1.5rem', flexWrap: 'wrap', justifyContent: 'center'}}>
    <Card 
      title="Women Blouse"
      description="Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
      price="125"
      rating={3}
      image="https://images.unsplash.com/photo-1541099649105-f69ad21f3246"
      sizes={['XS', 'S', 'M', 'L', 'XL']}
      colors={['#e91e63', '#ffc107', '#021a40']} // vermelho, amarelo, azul bem escuro
    />
    <Card 
      title="Children Shirt"
      description="Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
      price="45"
      rating={3}
      image="https://images.unsplash.com/photo-1530845649043-1f016d7e3b64"
      sizes={['XS', 'S', 'M', 'L', 'XL']}
      colors={['#6c63ff', '#021a40']} // roxo, azul escuro
    />
    <Card
      title="Men Flanel"
      description="Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
      price="75"
      rating={4}
      image="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f"
      sizes={['XS', 'S', 'M', 'L', 'XL']}
      colors={['#2196f3', '#cfd8dc', '#021a40']} // azul, cinza claro, azul escuro
    />
  </div>
  );
}
