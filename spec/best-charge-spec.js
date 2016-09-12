/*global describe, it, expect*/
'use strict';

describe('Take out food', function () {
  it('should format Iteems', () => {
    const items = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];

    let formattedItems = formatItems(items);

    const expected = [
      {
        id: 'ITEM0001',
        count: 1
      },
      {
        id: 'ITEM0013',
        count: 2
      },
      {
        id: 'ITEM0022',
        count: 1
      }
    ];

    expect(formattedItems).toEqual(expected);
  });

  it('should buildDetailedItems', () => {
    const formattedItems = [
      {
        id: 'ITEM0001',
        count: 1
      },
      {
        id: 'ITEM0013',
        count: 2
      },
      {
        id: 'ITEM0022',
        count: 1
      }
    ];

    let detailedItems = buildDetailedItems(formattedItems, loadAllItems());

    const expected = [
      {
        id: 'ITEM0001',
        name: '黄焖鸡',
        count: 1,
        price: 18
      },
      {
        id: 'ITEM0013',
        name: '肉夹馍',
        count: 2,
        price: 6
      },
      {
        id: 'ITEM0022',
        name: '凉皮',
        count: 1,
        price: 8
      }
    ];

    expect(detailedItems).toEqual(expected);
  });

  it('should buildPromotedItems', () =>{
    const detailedItems = [
      {
        id: 'ITEM0001',
        name: '黄焖鸡',
        count: 1,
        price: 18
      },
      {
        id: 'ITEM0013',
        name: '肉夹馍',
        count: 2,
        price: 6
      },
      {
        id: 'ITEM0022',
        name: '凉皮',
        count: 1,
        price: 8
      }
    ];

    let allPromotions = loadPromotions();

    let promotedItems = buildPromotedItems(detailedItems, allPromotions);

    const expected = [
      {
        name: '黄焖鸡',
        count: 1,
        isHalfPrice: true,
        totalPrice: 18
      },
      {
        name: '肉夹馍',
        count: 2,
        isHalfPrice: false,
        totalPrice: 12
      },
      {
        name: '凉皮',
        count: 1,
        isHalfPrice: true,
        totalPrice: 8
      }
    ];

    expect(promotedItems).toEqual(expected);
  });

  it('should calculateTotalPrices', ()=>{
    const promotedItems = [
      {
        name: '黄焖鸡',
        count: 1,
        isHalfPrice: true,
        totalPrice: 18
      },
      {
        name: '肉夹馍',
        count: 2,
        isHalfPrice: false,
        totalPrice: 12
      },
      {
        name: '凉皮',
        count: 1,
        isHalfPrice: true,
        totalPrice: 8
      }
    ];

    let totalPrices = calculateTotalPrices(promotedItems);

    const expected = {
      type: '指定菜品半价',
      totalPayPrice: 25,
      totalSaved: 13
    };

    expect(totalPrices).toEqual(expected);
  });

  it('should buildReceipt', () =>{
    const promotedItems = [
      {
        name: '黄焖鸡',
        count: 1,
        isHalfPrice: true,
        totalPrice: 18
      },
      {
        name: '肉夹馍',
        count: 2,
        isHalfPrice: false,
        totalPrice: 12
      },
      {
        name: '凉皮',
        count: 1,
        isHalfPrice: true,
        totalPrice: 8
      }
    ];

    const totalPrices = {
      type: '指定菜品半价',
      totalPayPrice: 25,
      totalSaved: 13
    };

    let receipt = buildReceipt(promotedItems, totalPrices);

    const expected = {
      promotedItems,
      type: totalPrices.type,
      totalPayPrice: totalPrices.totalPayPrice,
      totalSaved: totalPrices.totalSaved
    };
  });

   it('should generate best charge when best is 指定菜品半价', function () {
   let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
   let summary = bestCharge(inputs).trim();
   let expected = `
============= 订餐明细 =============
黄焖鸡 x 1 = 18元
肉夹馍 x 2 = 12元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
指定菜品半价(黄焖鸡，凉皮)，省13元
-----------------------------------
总计：25元
===================================`.trim();
   expect(summary).toEqual(expected)
   });

   it('should generate best charge when best is 满30减6元', function () {
   let inputs = ["ITEM0013 x 4", "ITEM0022 x 1"];
   let summary = bestCharge(inputs).trim();
   let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
满30减6元，省6元
-----------------------------------
总计：26元
===================================`.trim();
   expect(summary).toEqual(expected)
   });

   it('should generate best charge when no promotion can be used', function () {
   let inputs = ["ITEM0013 x 4"];
   let summary = bestCharge(inputs).trim();
   let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
-----------------------------------
总计：24元
===================================`.trim();
   expect(summary).toEqual(expected)
   });
});
