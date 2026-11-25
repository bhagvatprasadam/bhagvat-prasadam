import { media } from './media';

export const navigationLinks = [
  {
    name: "Sweets",
    path: "/collections/sweets",
    hasMegaMenu: true,
    subItems: [
      { name: "Winter Special", path: "/collections/winter-special" },
      { name: "Kaju Katli", path: "/products/kaju-katli-cashew-barfi-premium-kaju-katli" },
      { name: "Mohanthal", path: "/products/pure-traditional-gujarati-sweets-mohanthal" },
      { name: "Dry Fruits Chikki", path: "/products/dry-fruits-chikki-dry-fruit-punch-dates-nutritional-punch-premium-gujarati-sweet" },
      { name: "Kesar Peda", path: "/products/kesar-peda-saffron-indian-sweet-traditional-festival-sweet" },
      { name: "Motichur Laddu", path: "/products/motichur-laddu-traditional-indian-festival-sweet" },
      { name: "Boondi Laddu", path: "/products/boondi-laddu-traditional-indian-ladoo-sweet" },
      { name: "Churma Ladoo in Jaggery", path: "/products/churma-ladoo-in-jaggery-traditional-indian-ladoo-gud-ke-churma-ladoo" },
      { name: "More..", path: "/collections/sweets", isHighlight: true }
    ],
    featuredProducts: [
      {
        title: "Sukhadi | सुखड़ी | Gud Papdi",
        path: "/products/sukhadi-ghee-traditional-indian-barfi-traditional-gud-papdi",
        image: "https://megaecomm.megascale.co.in/backend/media/2/94d12507fe9e1ba7fbf83525e242a61d.webp",
        price: 424,
        comparePrice: 606,
        discount: 30
      },
      {
        title: "Motichur Laddu | मोतीचूर के लड्डू | Traditional Sweet",
        path: "/products/motichur-laddu-traditional-indian-festival-sweet",
        image: "https://megaecomm.megascale.co.in/backend/media/2/be4369a0397793d4a233b4e60c8e2025.webp",
        price: 377,
        comparePrice: 549,
        discount: 30
      },
      {
        title: "Mohanthal | मोहनथाल | Traditional Gujarati Sweet",
        path: "/products/pure-traditional-gujarati-sweets-mohanthal",
        image: "https://megaecomm.megascale.co.in/backend/media/2/98f396fc18d36015dd3c563d76ce1576.webp",
        price: 471,
        comparePrice: 675,
        discount: 30
      }
    ]
  },
  {
    name: "Namkeen",
    path: "/collections/namkeen",
    hasMegaMenu: true,
    subItems: [
      { name: "Banana Mari Wafer", path: "/products/banana-mari-wafer-spicy-indian-snack" },
      { name: "Aaloo Sev", path: "/products/aaloo-sev-crispy-indian-namkeen-snack" },
      { name: "Banana Masala Wafer", path: "/products/banana-masala-wafer-spicy-gujarati-namkeen-snack" },
      { name: "Bhavnagari Gathiya", path: "/products/bhavnagari-gathiya-crunchy-gujarati-namkeen-snack" },
      { name: "Kela Farali Chivda Meetha", path: "/products/kela-farali-chivda-meetha-sweet-gujarati-namkeen-snack" },
      { name: "Mix Chavanu", path: "/products/mix-chavanu-mixture-namkeen-gujarati-snacks" },
      { name: "More...", path: "/collections/namkeen", isHighlight: true }
    ],
    featuredProducts: [
      {
        title: "Mix Chavanu | नमकीन मिक्स चवाणु | Mixture Namkeen | Gujarati Snacks",
        path: "/products/mix-chavanu-mixture-namkeen-gujarati-snacks",
        image: "https://megaecomm.megascale.co.in/backend/media/2/d9dc2a0f0000e9b405f95c5954a73115.webp",
        price: 295,
        comparePrice: 380,
        discount: 22
      },
      {
        title: "Aaloo Sev | Crispy Potato Indian Namkeen Snack",
        path: "/products/aaloo-sev-crispy-indian-namkeen-snack",
        image: "https://megaecomm.megascale.co.in/backend/media/2/bdb5ffc0b310128fba1a46253abc91ac.webp",
        price: 295,
        comparePrice: 380,
        discount: 22
      },
      {
        title: "Banana Mari Wafer | Black Pepper Banana Chips",
        path: "/products/banana-mari-wafer-spicy-indian-snack",
        image: "https://megaecomm.megascale.co.in/backend/media/2/fb5e8997367f17e8196c1a601309d0b4.webp",
        price: 270,
        comparePrice: 340,
        discount: 21
      }
    ]
  },
  {
    name: "Natural Products",
    path: "/collections/natural",
    hasMegaMenu: true,
    subItems: [
      { name: "Traditional Desi Cow Ghee", path: "/products/gau-dham-traditional-desi-cow-ghee" },
      { name: "Cow Ghee (Gir Cow Ghee)", path: "/products/ghee" },
      { name: "Groundnut Oil", path: "/products/groundnut-oil-pure-cold-pressed-groundnut-oil" },
      { name: "Jaggery (Desi Gud)", path: "/products/jaggery-desi-gud-pure-and-natural-sweetener-by-bhagvat-prasadam" },
      { name: "Sindhav Salt", path: "/products/sindhav-salt-pure-and-mineral-rich-himalayan-salt" },
      { name: "Turmeric Powder", path: "/products/turmeric-powder-pure-and-potent-spice-by-bhagvat-prasadam" },
      { name: "Tuver Dal", path: "/products/tuver-dal-toor-dal-premium-quality-pigeon-peas-split" },
      { name: "More..", path: "/collections/natural-product", isHighlight: true }
    ],
    featuredProducts: [
      {
        title: "Cow Ghee | Pure Gir Cow Ghee | वैदिक बिलोना गाय का घी",
        path: "/products/ghee",
        image: "https://megaecomm.megascale.co.in/backend/media/2/6d416b02bc6bb380ef4da7d5919d865b.webp",
        price: 1850,
        comparePrice: 2200,
        discount: 16
      },
      {
        title: "Groundnut Oil Pure | Pure Cold-Pressed Groundnut Oil | मूंगफली का तेल",
        path: "/products/groundnut-oil-pure-cold-pressed-groundnut-oil",
        image: "https://megaecomm.megascale.co.in/backend/media/2/67bbe4f1ebe5d586f5204aa9b32069c9.webp",
        price: 490,
        comparePrice: 620,
        discount: 21
      },
      {
        title: "Turmeric Powder | Pure and Natural Spice | हल्दी पाउडर",
        path: "/products/turmeric-powder-pure-and-potent-spice-by-bhagvat-prasadam",
        image: "https://megaecomm.megascale.co.in/backend/media/2/3885b16d01a2461314b6913843bea8b2.webp",
        price: 400,
        comparePrice: 481,
        discount: 17
      }
    ]
  },
  {
    name: "Sugar Free Sweets",
    path: "/collections/sugar-free-sweets",
    hasMegaMenu: false
  },
  {
    name: "Our Gau Dham",
    path: "/pages/our-farms",
    hasMegaMenu: false
  },
  {
    name: "More",
    path: "/collections/all",
    hasMegaMenu: true,
    isSimpleDropdown: true,
    subItems: [
      { name: "Farali", path: "/collections/farali", description: "Satvik fasting snacks & delicacies" },
      { name: "Ayurvedic Product", path: "/collections/ayurvedic", description: "Herbal powders, moringa & amla" },
      { name: "Our Cows", path: "/pages/our-cows", description: "Divine Gau Seva at NilkanthDham" },
      { name: "Offers", path: "/collections/best-seller", description: "Special festive prasad discounts" }
    ]
  }
];

export const footerLinks = {
  categories: [
    { name: "Sweets", path: "/collections/sweets" },
    { name: "Namkeen", path: "/collections/namkeen" },
    { name: "Natural Products", path: "/collections/natural" },
    { name: "Farali", path: "/collections/farali" },
    { name: "Ayurvedic Products", path: "/collections/ayurvedic" },
    { name: "Sugar Free Sweets", path: "/collections/sugar-free-sweets" },
    { name: "Best Sellers", path: "/collections/best-seller" }
  ],
  quickLinks: [
    { name: "About Us & Temple", path: "/pages/about" },
    { name: "Contact Us", path: "/pages/contact" },
    { name: "FAQs", path: "/pages/faq" },
    { name: "Track Your Order", path: "/cart" },
    { name: "Wishlist", path: "/wishlist" },
    { name: "Our Cows & Gau Dham", path: "/pages/our-farms" }
  ],
  policies: [
    { name: "Return & Refund Policy", path: "/pages/faq" },
    { name: "Privacy Policy", path: "/pages/faq" },
    { name: "Terms & Conditions", path: "/pages/faq" },
    { name: "Shipping Policy", path: "/pages/faq" },
    { name: "Quality Assurance", path: "/pages/about" }
  ]
};
