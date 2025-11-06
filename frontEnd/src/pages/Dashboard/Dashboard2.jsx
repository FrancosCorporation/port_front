import React from "react";
import Card from "../../components/render/Card";

export default function Dashboard() {
  return (
    <div className="flex flex-wrap gap-6 justify-center p-6 bg-gray-100 min-h-screen">
      <Card
        title="Women Blouse"
        description="Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
        price="125"
        image="https://images.unsplash.com/photo-1541099649105-f69ad21f3246"
        colors={['#e91e63', '#ffc107', '#021a40']}
      />
      <Card
        title="Children Shirt"
        description="Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
        price="45"
        image="https://images.unsplash.com/photo-1530845649043-1f016d7e3b64"
        colors={['#6c63ff', '#021a40']}
      />
      <Card
        title="Men Flanel"
        description="Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
        price="75"
        image="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f"
        colors={['#2196f3', '#cfd8dc', '#021a40']}
      />
    </div>
  );
}
