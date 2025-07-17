// ProductData.js
const products = [
    {
        id: '1',
        name: 'Spectra Logic - power cable - IEC 60320 C14 to power IEC 60320 C13 - 8 ft',
        mfg: '9563',
        cdw: '3809689',
        imageUrl: 'https://placehold.co/100x100/E0E0E0/333333?text=Cable+Image', // Placeholder for cable image
        availability: '4-6 Weeks',
        availabilityText: 'Expected in-stock date for this item is between 4-6 weeks. Item will ship once it is in stock.',
        price: '1.99',
        specs: [
            { label: 'Cable Subcategory', value: 'Power' },
            { label: 'EPEAT Compliant', value: 'No' },
            { label: 'Left Connector Type', value: 'Power IEC 60320 C14' },
            { label: 'Length', value: '8 ft' },
            { label: 'Right Connector Type', value: 'Power IEC 60320 C13' },
        ]
    },
    {
        id: '2',
        name: 'Spectra Logic - power cable - IEC 60320 C13 - 8 ft',
        mfg: '9563',
        cdw: '3809689',
        imageUrl: 'https://placehold.co/100x100/E0E0E0/333333?text=Cable+Image', // Placeholder for cable image
        availability: '4-6 Weeks',
        availabilityText: 'Expected in-stock date for this item is between 4-6 weeks. Item will ship once it is in stock.',
        price: '1.99',
        specs: [
            { label: 'Cable Subcategory', value: 'Power' },
            { label: 'EPEAT Compliant', value: 'No' },
            { label: 'Left Connector Type', value: 'Power IEC 60320 C13' },
            { label: 'Length', value: '8 ft' },
            // Note: The second product in the UX image only shows 4 specs, so I'll reflect that.
        ]
    },
    {
        id: '3',
        name: 'StarTech.com 6ft HDMI Cable - 4K High Speed HDMI Cable w/ Ethernet - HDMI 1.4 - HDMI Monitor Cable - HDMI to HDMI Cable',
        mfg: 'HDMM6',
        cdw: '3036583',
        unspsc: '26121600',
        imageUrl: 'http://googleusercontent.com/file_content/1',
        originalPrice: '13.99',
        price: '13.29',
        priceLabel: 'My CDW Price',
        reviews: {
            stars: 4.5,
            count: 14
        },
        availability: '1028 units In Stock',
        availabilityText: 'Ships today if ordered within 5 hrs 4 mins',
        additionalActions: [
            { label: 'Add to Compare', type: 'checkbox' },
            { label: 'Save to Favorites', type: 'checkbox' }
        ],
        specs: []
    }
];

export default products;