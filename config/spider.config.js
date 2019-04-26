module.exports = {
  url: 'https://shopee.tw/%E7%BE%8E%E5%A6%9D%E4%BF%9D%E5%81%A5-cat.67',
  fields: [
    { value: 'brand', label: '品牌' },
    { value: 'sku_id', label: 'SKU ID' },
    { value: 'sku_name', label: '商品名称' },
    { value: 'category', label: '分类' },
    { value: 'price', label: '价格' },
    { value: 'discount', label: '折扣' },
    { value: 'stock', label: '库存' },
    { value: 'sold', label: '销量' },
    { value: 'link', label: '链接' }
  ],
  skuContentArr: [
    function brand(url, $) {
      return $('.product-detail ._2H-513').text() || '无法获取';
    },
    function sku_id(url, $) { 
      return url.split('-i.')[1].split('.')[1];
    },
    function sku_name(url, $) {
      return $('.product-briefing .qaNIZv').text() || '无法获取';
    },
    function category(url, $) {
      return $('.product-detail ._1z1CEl ._20XOUy').eq(2).text() || '无法获取'; 
    },
    function price(url, $) {
      return $('.product-briefing ._3n5NQx').text() || '无法获取';
    },
    function discount(url, $) {
      return $('.product-briefing .MITExd').length !== 0 ? parseFloat($('.product-briefing .MITExd').text().trim()) : 1;
    },
    function stock(url, $) {
      return $('.product-briefing ._1FzU2Y .items-center div').eq(2).text().replace(/[^\d]/gi, '') || '无法获取';
    },
    function sold(url, $) {
      return $('.product-briefing ._22sp0A').text() || '无法获取';
    },
    function link(url, $) { return decodeURI(url) },
  ]
}