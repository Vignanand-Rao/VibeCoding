import json

# Verified working Unsplash image pools
ELECTRONICS_IMAGES = [
    ("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80", "Black"),
    ("https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80", "White"),
    ("https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80", "Grey"),
    ("https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80", "Blue"),
    ("https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80", "Black"),
    ("https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=600&q=80", "Black"), # Anker Power Bank
    ("https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80", "Red"),   # USB-C Cable
    ("https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80", "White"),
    ("https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80", "Black"),
    ("https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=600&q=80", "White"),
    ("https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80", "Grey"),
    ("https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80", "Black"),
    ("https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80", "Blue"),
    ("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80", "Black"),
    ("https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=600&q=80", "Green"),
    ("https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=600&q=80", "White"),
    ("https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80", "Grey"),
    ("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80", "Grey"),
    ("https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80", "Black"),
    ("https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80", "Brown"),
    ("https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80", "Grey"),
]

APPAREL_IMAGES = [
    ("https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80", "Green"),
    ("https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80", "Grey"),
    ("https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80", "Blue"),  # Levi's Jeans
    ("https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80", "White"), # Lululemon Tech Tee
    ("https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80", "Black"),
    ("https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80", "Black"),
    ("https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80", "White"),
    ("https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80", "Black"),
    ("https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80", "Brown"),
    ("https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80", "Blue"),
    ("https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80", "Blue"),
    ("https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80", "Black"),
    ("https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=600&q=80", "Red"),
    ("https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80", "Grey"),
    ("https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80", "White"),
    ("https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=600&q=80", "Red"),
    ("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80", "Green"),
]

FOOTWEAR_IMAGES = [
    ("https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80", "Red"),   # Air Jordan 1
    ("https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=600&q=80", "White"),
    ("https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=600&q=80", "Brown"),
    ("https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80", "Grey"),
    ("https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80", "Black"),
    ("https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=600&q=80", "Red"),
    ("https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=80", "Blue"),
    ("https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80", "Black"),
    ("https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80", "Red"),
    ("https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80", "White"),
    ("https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=600&q=80", "Black"),
    ("https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=600&q=80", "Blue"),
    ("https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80", "Brown"),
]

# 52 items for Electronics
ELECTRONICS_ITEMS = [
    # Fixed items requested
    ("Anker 737 Power Bank 24000mAh", 9999.0, 4.8, 1420, "Ultra-powerful 140W fast-charging portable power bank with smart digital display.", "Black", 5),
    ("Basic Fast USB-C Charging Cable (2m)", 349.0, 4.2, 850, "Heavy-duty nylon braided 100W USB-C fast charging cord for all devices.", "Red", 6),
    # Below ₹500
    ("Tangle-Free 3.5mm Aux Audio Cable", 249.0, 3.8, 310, "Gold-plated connectors for high fidelity crystal clear sound transmission.", "Black", 0),
    ("Ultra-Slim Webcam Privacy Cover Slider (3-Pack)", 199.0, 4.5, 940, "Protects your digital privacy effortlessly with smooth mechanical slide.", "Black", 8),
    ("Braided Micro USB Fast Data Cable", 299.0, 3.4, 210, "Durable 2.4A fast charging wire compatible with older accessories.", "Grey", 2),
    ("Universal Silicone Cable Cord Organizer Clips", 189.0, 4.1, 430, "Desk cable management organizer prevents messy tangled desktop wires.", "White", 7),
    ("USB-C to USB-A High-Speed OTG Adapter", 399.0, 4.6, 680, "Plug and play aluminum shell high-speed data transfer adapter.", "Grey", 10),
    ("Anti-Static Microfiber Lens & Screen Cleaning Cloth", 229.0, 4.7, 540, "Ultra-soft lint-free microfiber designed for delicate displays and optics.", "Blue", 3),
    # ₹500 - ₹1,000
    ("boAt BassHeads 100 In-Ear Wired Earphones", 599.0, 4.3, 3100, "Super extra bass with 10mm dynamic drivers and in-line microphone.", "Black", 7),
    ("Portronics Clean M Multifunctional Cleaning Kit", 649.0, 4.4, 520, "Compact 8-in-1 tool kit for earbuds, keyboards, monitors and mobile screens.", "White", 1),
    ("Zebronics Comfort Optical USB Wired Mouse", 549.0, 4.0, 910, "Ergonomic symmetrical shape suitable for extended home and office sessions.", "Grey", 2),
    ("Ambrane 10000mAh Compact Power Bank", 899.0, 4.2, 1850, "Pocket-friendly fast charging battery bank with dual USB output ports.", "Green", 14),
    ("pTron Bullet 3.1A Fast Car Charger", 699.0, 3.9, 410, "Dual-port metallic auto charger with multi-layer device protection.", "Black", 8),
    ("AmazonBasics Ergonomic Gel Mouse Pad", 599.0, 4.5, 1200, "Comfortable memory foam wrist rest for fatigue-free precision navigation.", "Blue", 12),
    ("SanDisk Ultra 64GB MicroSDXC Memory Card", 749.0, 4.6, 2800, "Fast Class 10 read speeds up to 140MB/s for smartphones and tablets.", "Red", 6),
    ("TP-Link Nano USB WiFi Adapter 150Mbps", 849.0, 4.1, 1400, "Miniature discreet adapter provides dependable wireless connectivity.", "White", 9),
    # ₹1,000 - ₹2,500
    ("Redragon K552 RGB Mechanical Keyboard", 2399.0, 4.6, 1750, "Tenkeyless compact layout with responsive tactile dustproof blue switches.", "Black", 4),
    ("Noise Buds VS104 Truly Wireless Earbuds", 1299.0, 4.1, 3200, "45 hours total playtime with Quad Mic environmental noise cancellation.", "Green", 14),
    ("boAt Stone 180 Portable Bluetooth Speaker", 1499.0, 4.4, 2100, "IPX7 water resistant outdoor speaker with powerful 5W stereo output.", "Blue", 3),
    ("MI 20000mAh 18W Fast Charging Power Bank", 1999.0, 4.5, 4100, "Triple port output allows simultaneous rapid power distribution to devices.", "Black", 5),
    ("Logitech K380 Multi-Device Bluetooth Keyboard", 2495.0, 4.7, 1890, "Lightweight minimalist wireless keyboard connects with up to 3 devices.", "White", 1),
    ("Realme Buds Air 3 Neo TWS with Dolby Atmos", 1799.0, 4.3, 1600, "Bass boost drivers and AI ENC calls for immersive crystal audio.", "White", 15),
    ("Cosmic Byte Equinox Kronos Wireless Gaming Headset", 2299.0, 4.2, 730, "7.1 surround sound audio with ultra-low latency 2.4GHz wireless dongle.", "Black", 0),
    ("Syska Smart LED WiFi Desk Lamp with Dimming", 1399.0, 4.0, 480, "App and voice control lamp with customizable color temperature modes.", "White", 7),
    # ₹2,500 - ₹5,000
    ("JBL Flip Essential 2 Wireless Speaker", 4499.0, 4.7, 2400, "Signature JBL Original Pro Sound with rugged IPX7 waterproof casing.", "Grey", 10),
    ("OnePlus Nord Watch with AMOLED Display", 3799.0, 4.3, 1650, "Vibrant 1.78 inch high resolution display with 105 sports modes.", "Blue", 12),
    ("Razer DeathAdder V2 Ergonomic Gaming Mouse", 3499.0, 4.8, 3100, "Focus+ 20K DPI optical sensor and lightning optical switches.", "Black", 2),
    ("Boya BY-M1 Pro Omnidirectional Lavalier Mic", 2799.0, 4.5, 870, "Professional studio broadcast lapel microphone for cameras and PCs.", "Black", 18),
    ("Amazfit Bip 3 Pro Smartwatch with Built-in GPS", 3999.0, 4.4, 1120, "4 satellite positioning systems and blood-oxygen saturation monitoring.", "Green", 14),
    ("Logitech C920e Full HD 1080p Webcam", 4999.0, 4.6, 2150, "Dual integrated stereo mics with automatic low light correction.", "Black", 0),
    ("WD Elements 1TB Portable External Hard Drive", 4699.0, 4.5, 5200, "High-capacity USB 3.0 reliable mobile storage for backup files.", "Black", 18),
    ("Sony WI-C100 Wireless In-Ear Neckband", 2690.0, 4.2, 1340, "25 hours battery life with Dolby Atmos compatibility and splash proofing.", "Blue", 3),
    # ₹5,000 - ₹10,000
    ("Sony WH-CH720N Noise Canceling Headphones", 7990.0, 4.6, 1890, "Dual noise sensor technology with integrated Processor V1 for pure audio.", "Black", 0),
    ("Logitech MX Master 3S Performance Wireless Mouse", 8995.0, 4.8, 4120, "Quiet clicks, 8K DPI sensor, and MagSpeed electromagnetic scrolling.", "Grey", 2),
    ("Marshall Willen Ultra-Compact Bluetooth Speaker", 9999.0, 4.7, 780, "Iconic Marshall vintage aesthetic with 15+ hours of heavy playtime.", "Black", 19),
    ("Samsung Galaxy Watch4 Bluetooth Smartwatch", 8999.0, 4.4, 3400, "Comprehensive body composition analysis and advanced sleep tracking.", "White", 1),
    ("Keychron K2 V2 Wireless Mechanical Keyboard", 7499.0, 4.7, 950, "Compact 84-key RGB backlit layout with Mac and Windows dual layout.", "Brown", 19),
    ("Audio-Technica ATH-M40x Professional Monitor Headphones", 8490.0, 4.8, 2600, "Flat frequency response tuned accurately for mixing and studio monitoring.", "Black", 11),
    ("Fujifilm Instax Mini 12 Instant Film Camera", 6499.0, 4.6, 1420, "Automatic exposure and close-up selfie mode produces instant photos.", "Green", 14),
    ("Fitbit Charge 6 Advanced Fitness Tracker", 9499.0, 4.3, 890, "Electrocardiogram ECG and EDA stress management sensors with GPS.", "Red", 6),
    # Above ₹10,000
    ("Sony WH-1000XM5 Premium Noise Canceling Headphones", 29990.0, 4.9, 3200, "Industry benchmark noise cancellation with 8 microphones and LDAC.", "Black", 0),
    ("Apple Watch Ultra 2 Titanium GPS + Cellular", 79900.0, 4.9, 1450, "Rugged aerospace titanium case engineered for endurance and extreme sports.", "White", 1),
    ("Bose QuietComfort 45 Wireless Headphones", 24900.0, 4.8, 2100, "World-class acoustic noise cancelling with lush synthesized comfort.", "White", 7),
    ("Sony PlayStation 5 DualSense Edge Wireless Controller", 18990.0, 4.7, 860, "High-performance modular customizable controller with haptic feedback.", "White", 15),
    ("GoPro HERO12 Black Waterproof Action Camera", 37990.0, 4.6, 1100, "5.3K60 HDR video recording with HyperSmooth 6.0 digital stabilization.", "Black", 18),
    ("Apple iPad 10th Generation 64GB WiFi", 36900.0, 4.8, 2900, "Stunning 10.9-inch Liquid Retina display with A14 Bionic processor.", "Blue", 12),
    ("Dell UltraSharp 27-Inch 4K UHD USB-C Hub Monitor", 48990.0, 4.8, 640, "IPS Black technology with 98% DCI-P3 wide color gamut coverage.", "Grey", 16),
    ("Samsung Galaxy Tab S9 FE with S-Pen", 34999.0, 4.6, 920, "IP68 water resistant Android productivity tablet with smooth 90Hz screen.", "Grey", 20),
    ("Sennheiser Momentum 4 Wireless Audiophile Headphones", 28990.0, 4.7, 1310, "Astonishing 60-hour battery stamina with audiophile-grade 42mm sound.", "Black", 0),
    ("Canon EOS R50 Mirrorless Camera with 18-45mm Lens", 56990.0, 4.7, 490, "24.2 MP APS-C sensor with Dual Pixel CMOS AF II and uncropped 4K.", "Black", 18),
    ("LG UltraGear 32-Inch QHD 165Hz Gaming Monitor", 23999.0, 4.6, 1180, "1ms MBR response time with HDR10 and AMD FreeSync Premium support.", "Black", 16),
    ("Bose Smart Soundbar 600 with Dolby Atmos", 49900.0, 4.8, 730, "True spatial audio immersion with proprietary TrueSpace signal processing.", "Black", 3),
]

# 52 items for Apparel
APPAREL_ITEMS = [
    # Fixed items requested
    ("Levi's 511 Slim Fit Stretch Denim Jeans", 2999.0, 4.5, 3400, "Modern slim-cut jeans with added stretch for all-day flexible mobility.", "Blue", 2),
    ("Lululemon Metal Vent Tech Athletic T-Shirt", 3499.0, 4.8, 890, "Seamless breathable training shirt engineered with anti-stink Silverescent technology.", "White", 3),
    # Below ₹500
    ("Men's Basic Solid Crew Neck Cotton T-Shirt", 349.0, 3.8, 1200, "Pure combed breathable cotton t-shirt for daily relaxed wear.", "Black", 5),
    ("Classic Ankle Athletic Sport Socks (3-Pack)", 299.0, 4.4, 2100, "Cushioned arch support socks with moisture-wicking knit fibers.", "White", 6),
    ("Men's Regular Fit Cotton Vest Undershirt", 249.0, 4.1, 850, "Ribbed 100% cotton tank vest providing cool lightweight comfort.", "Grey", 1),
    ("Gym & Workout Compression Wrist Sweatband Set", 199.0, 4.3, 490, "High absorbency terry cloth bands for heavy fitness workouts.", "Red", 12),
    ("Breathable Running Cap with UV Protection", 399.0, 4.2, 730, "Laser-cut perforated panels and adjustable reflective strap closure.", "Black", 7),
    ("Solid Ribbed Cotton Beanie Winter Skull Cap", 349.0, 4.0, 620, "Soft stretchy knit cap designed for cool weather insulation.", "Brown", 8),
    ("Cotton Bandana Head Wrap Scarf", 229.0, 3.9, 310, "Versatile printed paisley cotton square bandana.", "Blue", 10),
    ("Lightweight Canvas Webbing Belt with Metal Buckle", 399.0, 4.5, 980, "Fully adjustable durable canvas tactical military style belt.", "Green", 0),
    # ₹500 - ₹1,000
    ("Jockey Men's Cotton Jogger Lounge Pants", 999.0, 4.5, 3800, "Super soft french terry fabric with elastic drawstring waistband.", "Grey", 13),
    ("Allen Solly Regular Fit Pique Polo T-Shirt", 899.0, 4.3, 2900, "Classic tipped collar polo crafted with durable breathable pique cotton.", "Red", 15),
    ("Puma Essential Logo Men's Fleece Shorts", 849.0, 4.2, 1400, "Relaxed fit training shorts with side pockets and elasticated waist.", "Black", 5),
    ("US Polo Assn Embroidered Casual Tee", 799.0, 4.4, 2150, "Premium bio-washed cotton graphic tee with signature brand insignia.", "White", 3),
    ("Van Heusen Men's Formal Dress Shirt", 999.0, 4.4, 1850, "Wrinkle-resistant pinpoint oxford tailored for crisp professional wear.", "Blue", 9),
    ("Wrangler Regular Fit Cotton Chino Shorts", 899.0, 4.1, 740, "Durable twill utility shorts with reinforced stitching throughout.", "Brown", 8),
    ("Decathlon Kalenji Dry Breathable Running Tee", 599.0, 4.6, 3100, "Hydrophobic fabric keeps runners dry and fresh across warm trails.", "Green", 16),
    ("Peter England Casual Cotton Check Shirt", 899.0, 4.0, 1100, "Vibrant yarn-dyed checks tailored in a versatile semi-spread collar.", "Red", 12),
    # ₹1,000 - ₹2,500
    ("Nike Club Fleece Pullover Brushed Hoodie", 2499.0, 4.7, 3100, "Classic cozy fleece with adjustable drawstring hood and kangaroo pocket.", "Grey", 1),
    ("H&M Regular Fit Denim Trucker Jacket", 2299.0, 4.4, 1200, "Sturdy washed denim jacket with flap chest pockets and metal buttons.", "Blue", 2),
    ("Adidas Essentials 3-Stripes Track Pants", 1899.0, 4.5, 2400, "Tapered legs and iconic side stripes constructed with recycled tricot.", "Black", 7),
    ("Zara Slim Fit Stretch Chino Trousers", 2290.0, 4.3, 1150, "Versatile tailored chinos made with elasticated cotton twill blend.", "Brown", 8),
    ("Under Armour Tech 2.0 Short Sleeve Gym Shirt", 1499.0, 4.6, 1780, "Loose, light, and keeps you cool with quick-drying UA Tech fabric.", "Red", 12),
    ("Flying Machine Slim Tapered Blue Jeans", 1799.0, 4.2, 1450, "Comfort stretch faded jeans with vintage whiskering accents.", "Blue", 10),
    ("Marks & Spencer Pure Linen Casual Shirt", 2499.0, 4.6, 920, "Airy pure linen shirt designed for breathable summer sophistication.", "White", 14),
    ("Superdry Vintage Athletic Graphic Hoodie", 2399.0, 4.5, 870, "Signature cracked heritage print with heavy ribbed cuffs and hem.", "Green", 0),
    # ₹2,500 - ₹5,000
    ("The North Face Apex Bionic Softshell Jacket", 4999.0, 4.7, 1800, "100% windproof fabric jacket offering breathable thermal comfort.", "Black", 4),
    ("Tommy Hilfiger Signature Knitted Cotton Sweater", 4499.0, 4.6, 950, "Pure combed cotton knit with subtle embroidered flag chest branding.", "Blue", 9),
    ("Calvin Klein Jeans Straight Fit Classic Denim", 3999.0, 4.4, 1100, "Mid-rise vintage wash denim with iconic back pocket omega embroidery.", "Blue", 2),
    ("Nike Storm-FIT Windrunner Running Jacket", 4795.0, 4.8, 1250, "Weather-resistant shell defends against cold gusting winds and rainfall.", "White", 6),
    ("Polo Ralph Lauren Custom Slim Fit Mesh Polo", 4990.0, 4.7, 1340, "The timeless mesh cotton polo cut with high armholes and trim body.", "Red", 15),
    ("Columbia Steens Mountain Full Zip Fleece Jacket", 3499.0, 4.6, 2100, "Deep filament fleece keeps outdoor hikers toasty around campfire trails.", "Green", 0),
    ("Benetton Italian Wool Blend Knit Cardigan", 3799.0, 4.3, 560, "Ribbed button-front cardigan offering refined cozy layering.", "Brown", 8),
    ("Jack & Jones Leather Biker Moto Jacket", 4999.0, 4.2, 780, "Asymmetrical zipper motorcycle style jacket with quilted shoulder pads.", "Black", 7),
    # ₹5,000 - ₹10,000
    ("Patagonia Nano Puff Lightweight Insulated Jacket", 9999.0, 4.9, 1420, "Warm, windproof, water-resistant PrimaLoft Gold Eco insulation.", "Green", 0),
    ("Ralph Lauren Polo Bear Fleece Sweatshirt", 8990.0, 4.8, 710, "Signature collegiate bear graphic on plush cotton blend fleece.", "White", 14),
    ("Barbour Powell Quilted Tailored Fleece Jacket", 9499.0, 4.7, 430, "Contemporary quilted jacket with microfleece lining and leather trim.", "Brown", 8),
    ("Diesel D-Strukt Slim Fit Distressed Jeans", 8999.0, 4.5, 890, "Premium Italian stretch denim with handcrafted whiskering details.", "Blue", 2),
    ("Arc'teryx Kyanite Lightweight Polartec Fleece", 9890.0, 4.8, 620, "Torrent fleece jacket delivers thermal regulation and stretch mobility.", "Black", 4),
    ("G-Star RAW Motac 3D Slim Tapered Jeans", 7499.0, 4.4, 670, "Articulated ribbed knee inserts inspired by motocross rider suits.", "Grey", 13),
    ("Ted Baker Semi-Formal Textured Wool Blazer", 9990.0, 4.6, 380, "Modern notch lapel blazer crafted from textured virgin wool weave.", "Blue", 9),
    ("Helly Hansen Crew Waterproof Sailing Jacket", 8499.0, 4.7, 590, "Helly Tech Protection fabric keeps offshore sailors fully dry.", "Red", 12),
    # Above ₹10,000
    ("Canada Goose Freestyle Insulated Down Vest", 24990.0, 4.9, 580, "625 fill power white duck down vest offering high-performance core warmth.", "Black", 4),
    ("AllSaints Milo Leather Biker Motorcycle Jacket", 32900.0, 4.8, 720, "Handcrafted lambskin leather jacket with silver-tone hardware accents.", "Black", 11),
    ("Burberry Classic Heritage Vintage Trench Coat", 69900.0, 4.9, 310, "Bespoke weatherproof cotton gabardine trench with iconic vintage check.", "Brown", 8),
    ("Hugo Boss Virgin Wool Two-Piece Formal Suit", 44990.0, 4.8, 490, "Impeccably tailored slim fit suit woven from fine Italian virgin wool.", "Blue", 9),
    ("Moncler Maya Lacquered Nylon Down Jacket", 74990.0, 4.9, 290, "Glossy boudin quilting packed with pure French goose down fill.", "Red", 15),
    ("Stone Island Garment Dyed Crinkle Reps NY Jacket", 41900.0, 4.8, 420, "Resin-coated wind and water resistant outer shell with sleeve badge.", "Green", 16),
    ("Acne Studios Oversized Heavy Wool Scarf & Coat Set", 28500.0, 4.7, 340, "Scandinavian minimalist brushed alpaca and wool outerwear silhouette.", "Grey", 13),
    ("Belstaff Trialmaster Heavyweight Waxed Cotton Jacket", 38900.0, 4.8, 390, "Historic British 6oz waxed cotton jacket with four iconic storm pockets.", "Brown", 8),
    ("Mackage Edward Down Parka with Real Shearling", 58900.0, 4.9, 210, "Sub-zero blizzard protection with 800+ fill power down and fur trim.", "Black", 4),
    ("Paul Smith Signature Artist Stripe Wool Overcoat", 47500.0, 4.7, 280, "Classic single-breasted wool cashmere coat with hidden colorful trim.", "Black", 11),
    ("Zegna Oasi Cashmere Lightweight Half-Zip Sweater", 52000.0, 4.9, 180, "Supreme ultra-fine cashmere spun with unmatched cloudlike softness.", "White", 14),
    ("Tom Ford Ribbed Wool & Suede Panelled Cardigan", 79900.0, 4.9, 150, "Sumptuous chunky ribbed wool body with butter-soft suede front panels.", "Brown", 8),
]

# 52 items for Footwear
FOOTWEAR_ITEMS = [
    # Fixed items requested
    ("Nike Air Jordan 1 Retro High OG Chicago", 16995.0, 4.9, 4200, "Iconic high-top basketball sneaker crafted with genuine full-grain leather and Nike Air.", "Red", 0),
    # Below ₹500
    ("Comfort Lightweight EVA Shower Slides", 299.0, 3.8, 1400, "Slip-resistant waterproof cushioned slides for pool, locker room and casual wear.", "Black", 7),
    ("Soft Sole Cotton Bedroom Loafer Slippers", 349.0, 4.2, 890, "Breathable plush memory foam indoor slippers with anti-skid rubber grip.", "Grey", 3),
    ("Quick-Dry Beach Flip-Flop Thong Sandals", 249.0, 3.6, 750, "Flexible high-density foam soles with comfortable textured strap.", "Blue", 6),
    ("Elastic No-Tie Heavy Duty Boot Laces (Pair)", 189.0, 4.6, 1200, "Tangle-free elastic silicone laces turn any sneakers into slip-ons.", "White", 1),
    ("Anti-Blister Running Socks & Shoe Grips", 299.0, 4.4, 910, "Padded friction barrier socks for marathoners and athletic trail runners.", "Red", 5),
    ("Everyday Casual Canvas Slip-On Plimsolls", 499.0, 3.9, 620, "Clean minimalist canvas casual shoes with vulcanized flat rubber sole.", "White", 9),
    ("Orthopedic Memory Foam Arch Support Insoles", 399.0, 4.5, 1850, "Trimmable shock-absorbing gel insoles for maximum arch pain relief.", "Blue", 11),
    ("Lightweight Aqua Water Shoes for Swimming", 449.0, 4.3, 530, "Quick-drying honeycomb mesh footwear with protective coral beach soles.", "Black", 10),
    # ₹500 - ₹1,000
    ("Sparx Men's Mesh Lightweight Running Shoes", 899.0, 4.2, 4500, "Breathable engineered mesh upper paired with flexible EVA traction sole.", "Grey", 3),
    ("Campus Men's Oxyfit Walking Sneakers", 799.0, 4.1, 3800, "Cushioned memory tech insole delivers lightweight rebound during walks.", "Blue", 6),
    ("Bata Men's Formal Slip-On Dress Shoes", 999.0, 4.3, 2100, "Sleek faux leather monk strap loafers for smart office workplace attire.", "Black", 4),
    ("Woodland Casual Canvas Deck Boat Shoes", 949.0, 4.0, 1100, "Durable canvas uppers with textured rubber siped nautical soles.", "Brown", 2),
    ("Paragon Max Cushion Arch-Fit Sport Sandals", 699.0, 4.4, 1800, "Adjustable velcro straps with rugged contoured outdoor footbed.", "Black", 7),
    ("Red Tape Men's Low-Top Casual Sneakers", 999.0, 4.3, 2600, "Contrast back-tab design with cushioned collar and clean cupsole.", "White", 1),
    ("Asian Men's Jasper High-Traction Jogging Shoes", 649.0, 3.9, 1950, "Air-cushion heel unit absorbs ground impact across morning runs.", "Red", 8),
    ("Action EVA Lightweight Active Sport Clogs", 549.0, 4.2, 1300, "Ventilated water-resistant clog shoes with swivel heel lock strap.", "Green", 10),
    # ₹1,000 - ₹2,500
    ("Puma Smash v2 Leather Classic Court Shoes", 2199.0, 4.5, 4100, "Clean leather tennis trainer with softfoam+ sockliner for cloud comfort.", "White", 1),
    ("Converse Chuck Taylor All Star Low Canvas", 2499.0, 4.4, 5200, "The timeless globally recognized canvas sneaker with vulcanized outsole.", "Red", 5),
    ("Adidas Runfalcon 3.0 Flexible Running Shoes", 2399.0, 4.3, 2800, "Cloudfoam midsole provides step-in comfort and supreme cushioning.", "Black", 10),
    ("Vans Authentic Classic Low-Top Skate Shoes", 2299.0, 4.6, 3400, "Sturdy canvas uppers featuring heritage waffle rubber traction soles.", "Black", 4),
    ("Skechers Go Walk Max Slip-On Walking Shoes", 2499.0, 4.7, 3900, "High-rebound cushioning with 5GEN proprietary lightweight foam.", "Grey", 3),
    ("Reebok Stride Runner Men's Road Shoes", 1799.0, 4.2, 1400, "Grooved outsole flexes naturally with every runner's foot strike.", "Blue", 6),
    ("Crocs Classic Lightweight Breathable Clogs", 1995.0, 4.6, 6800, "Original Croslite foam construction provides iconic lightweight bliss.", "Green", 10),
    ("Bata Comfit Ergonomic Leather Office Loafers", 1899.0, 4.4, 1200, "Genuine polished leather with padded collar and ergonomic arch bed.", "Brown", 2),
    # ₹2,500 - ₹5,000
    ("Nike Revolution 6 Next Nature Road Runners", 3695.0, 4.6, 3100, "Plush mesh collar and full-length foam deliver an intuitive ride.", "Black", 4),
    ("Adidas Ultraboost Light Performance Runners", 4999.0, 4.8, 2900, "Epic energy return with our lightest BOOST cushioning ever.", "White", 1),
    ("New Balance 574 Core Retro Heritage Sneakers", 4499.0, 4.7, 2400, "Suede and mesh uppers supported by ENCAP midsole technology.", "Grey", 3),
    ("Vans Old Skool Suede Sidestripe Skate Shoes", 3999.0, 4.6, 5100, "Legendary low-top skate silhouette with reinforced toe caps.", "Black", 4),
    ("Clarks Tilden Walk Leather Derby Formal Shoes", 4499.0, 4.5, 1250, "Full-grain genuine leather with Ortholite footbed and discreet gore.", "Brown", 2),
    ("Puma Future Rider Play On Retro Sneakers", 3499.0, 4.5, 1600, "Vibrant colour-blocking with shock-absorbing Federbein slim outsole.", "Red", 8),
    ("Under Armour Charged Assert 9 Running Shoes", 4299.0, 4.6, 1750, "Charged Cushioning midsole uses compression molded foam for durability.", "Blue", 11),
    ("ASICS Gel-Venture 9 Trail Running Shoes", 4799.0, 4.7, 1920, "Rearfoot GEL technology cushioning absorbs outdoor trail impact.", "Green", 10),
    # ₹5,000 - ₹10,000
    ("Nike Air Force 1 '07 Classic Low Basketball", 7495.0, 4.8, 6200, "Crisp stitched leather overlays with encapsulated Air cushioning.", "White", 1),
    ("Adidas Originals Stan Smith Sustainable Shoes", 6999.0, 4.7, 3400, "Timeless court clean style crafted from Primegreen recycled materials.", "White", 1),
    ("Timberland 6-Inch Premium Waterproof Boot", 9999.0, 4.8, 2900, "Original rugged nubuck leather waterproof boot with lug rubber soles.", "Brown", 2),
    ("New Balance 990v6 Made in USA Running Shoes", 9990.0, 4.8, 1420, "FuelCell foam drives you forward with ENCAP supportive rim.", "Grey", 3),
    ("Nike Pegasus 40 Road Running Athletic Shoes", 8995.0, 4.7, 2800, "Dual Zoom Air units deliver bounce across long daily running workouts.", "Blue", 11),
    ("Hoka One One Clifton 9 Lightweight Road Runners", 9499.0, 4.8, 1650, "Revitalized underfoot experience with responsive new compression foam.", "Blue", 6),
    ("On Running Cloud 5 Lightweight Speed Sneakers", 9990.0, 4.7, 2100, "Patented CloudTec technology in Zero-Gravity foam for soft landings.", "Black", 4),
    ("Birkenstock Arizona Birko-Flor Double-Strap", 6990.0, 4.6, 3100, "Anatomically shaped cork-latex footbed conforms to your foot shape.", "Brown", 12),
    # Above ₹10,000
    ("Nike Air Jordan 4 Retro Military High Sneakers", 18995.0, 4.9, 3100, "Legendary silhouette with supportive quarter wings and visible Air-Sole.", "Blue", 6),
    ("Adidas Yeezy Boost 350 V2 Core Black", 22999.0, 4.8, 2800, "Re-engineered Primeknit upper atop full-length responsive Boost sole.", "Black", 4),
    ("Nike Vaporfly 3 Elite Marathon Racing Shoes", 20695.0, 4.9, 1100, "Full-length carbon fiber flyplate paired with ZoomX superfoam.", "White", 1),
    ("Balenciaga Triple S Chunky Clear Sole Sneakers", 78900.0, 4.7, 650, "Complex 3-layered outsole infused with avant-garde high fashion.", "White", 9),
    ("Gucci Ace Embroidered Leather Low-Top Sneaker", 64000.0, 4.8, 480, "Classic retro low-top trainer with signature green and red web stripe.", "White", 1),
    ("Salomon S/Lab XT-6 Advanced Trail Running Shoes", 16999.0, 4.8, 1420, "Agile Chassis System delivers stable dual-density EVA cushioning.", "Red", 8),
    ("Golden Goose Super-Star Distressed Leather Sneakers", 46500.0, 4.6, 520, "Handmade Venetian distressed leather trainer with iconic star patch.", "White", 1),
    ("Common Projects Original Achilles Low Minimalist", 36900.0, 4.8, 890, "Handcrafted in Italy with smooth nappa leather and gold foil stamp.", "White", 9),
    ("Red Wing Heritage Iron Ranger 6-Inch Leather Boots", 28900.0, 4.9, 1340, "Heavy-duty amber harness leather with Goodyear welt and Vibram 430 mini-lug.", "Brown", 2),
    ("Alexander McQueen Oversized Rubber Sole Sneaker", 49500.0, 4.7, 780, "Signature exaggerated rubber sole with calf leather rounded toe.", "White", 1),
    ("Christian Louboutin Louis Orlato High-Top Spikes", 84900.0, 4.9, 210, "Supple calf leather high top adorned with signature red lacquered sole.", "Black", 4),
    ("Nike SB Dunk Low Pro Skateboard Shoes", 12995.0, 4.8, 3800, "Zoom Air unit in the heel and padded tongue built for intense skating.", "Blue", 6),
]

def build_dataset():
    products = []
    pid = 1

    # 1. Electronics (52 products)
    for name, price, rating, count, desc, color, img_idx in ELECTRONICS_ITEMS:
        img_url, _ = ELECTRONICS_IMAGES[img_idx % len(ELECTRONICS_IMAGES)]
        products.append({
            "id": pid,
            "name": name,
            "category": "Electronics",
            "price": float(price),
            "rating": float(rating),
            "rating_count": int(count),
            "color": color,
            "image": img_url,
            "description": desc
        })
        pid += 1

    # 2. Apparel (52 products)
    for name, price, rating, count, desc, color, img_idx in APPAREL_ITEMS:
        img_url, _ = APPAREL_IMAGES[img_idx % len(APPAREL_IMAGES)]
        products.append({
            "id": pid,
            "name": name,
            "category": "Apparel",
            "price": float(price),
            "rating": float(rating),
            "rating_count": int(count),
            "color": color,
            "image": img_url,
            "description": desc
        })
        pid += 1

    # 3. Footwear (52 products)
    for name, price, rating, count, desc, color, img_idx in FOOTWEAR_ITEMS:
        img_url, _ = FOOTWEAR_IMAGES[img_idx % len(FOOTWEAR_IMAGES)]
        products.append({
            "id": pid,
            "name": name,
            "category": "Footwear",
            "price": float(price),
            "rating": float(rating),
            "rating_count": int(count),
            "color": color,
            "image": img_url,
            "description": desc
        })
        pid += 1

    with open("backend/app/data/products.json", "w", encoding="utf-8") as f:
        json.dump(products, f, indent=2)

    print(f"Generated {len(products)} products across categories:")
    for cat in ["Electronics", "Apparel", "Footwear"]:
        count = sum(1 for p in products if p["category"] == cat)
        print(f"  - {cat}: {count} products")
    
    colors = set(p["color"] for p in products)
    print(f"Colors ({len(colors)}): {sorted(list(colors))}")
    print(f"Min Price: INR {min(p['price'] for p in products)}")
    print(f"Max Price: INR {max(p['price'] for p in products)}")

if __name__ == "__main__":
    build_dataset()
