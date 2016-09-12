function formatItems(items) {
  return items.map((item) => {
    let temp = item.split(' ');

    return {
      id: temp[0],
      count: parseInt(temp[2])
    };
  });
}

function exitEqualIdItem(array, id) {
  return array.find((item) => item.id === id);
}

function buildDetailedItems(formattedItems, allItems) {
  return formattedItems.map(({id, count} )=>{
   let {name, price} = exitEqualIdItem(allItems, id);

    return {
      id,
      name,
      count,
      price,
    };
  });
}

function buildPromotedItems(detailedItems, allPromotions) {
  let halfPromotion = allPromotions.find((allPromotion) => allPromotion.type === '指定菜品半价');

  return detailedItems.map(({id, name, count, price}) =>{
    let isHalfPrice = false;
    let totalPrice = 0;

    let item = halfPromotion.items.find((halfPromotionId) => halfPromotionId === id);
    if(item) {
      isHalfPrice = true;
    }
    totalPrice = parseFloat((count *  price).toFixed(2));

    return {
      name,
      count,
      isHalfPrice,
      totalPrice
    };
  });
}

function calculateTotalPrices(promotedItems) {
  let type;
  let totalSaved = 0;

  let {allTotalPrice, totalHalfPrice} = promotedItems.reduce((result, promotedItem) =>{
    result.allTotalPrice += promotedItem.totalPrice;
    if(promotedItem.isHalfPrice === true)
      result.totalHalfPrice += parseFloat((promotedItem.totalPrice / 2).toFixed(2));

    return result;
  }, {allTotalPrice: 0, totalHalfPrice: 0});

  if(allTotalPrice < 30)
    type = totalHalfPrice === 0 ? '' : '满30减6元';
  else
    type = (allTotalPrice - 6) <= (allTotalPrice - totalHalfPrice) ? '满30减6元' : '指定菜品半价';

  if(type)
   totalSaved = (type === '满30减6元') ? 6 : totalHalfPrice;

  let totalPayPrice = allTotalPrice - totalSaved;

  return {
    type,
    totalPayPrice,
    totalSaved
  };
}

function buildReceipt(promotedItems, totalPrices) {
  return {
    promotedItems,
    type: totalPrices.type,
    totalPayPrice: totalPrices.totalPayPrice,
    totalSaved: totalPrices.totalSaved
  };
}

function buildReceiptString(receipt) {
  let lines = [];

  lines.push('============= 订餐明细 =============');
  let line = receipt.promotedItems.reduce((result, {name, count, isHalfPrice, totalPrice}) =>{
    result.push(`${name} x ${count} = ${totalPrice}元`);

    return result;
  }, []);
  lines.push(line.join('\n'));

  if(receipt.type){
    lines.push('-----------------------------------');
    lines.push('使用优惠:');

    if(receipt.type === '指定菜品半价'){
      let halfItems = receipt.promotedItems.reduce((result, {name, count, isHalfPrice, totalPrice}) =>{
        if(isHalfPrice === true)
          result.push(name);
        return result;
      }, []);
      lines.push(`指定菜品半价(${halfItems.join('，')})，省${receipt.totalSaved}元`);
    }
    else
      lines.push('满30减6元，省6元');
  }

  lines.push('-----------------------------------');
  lines.push(`总计：${receipt.totalPayPrice}元`);
  lines.push('===================================');

  return lines.join('\n');
}

function bestCharge(items) {
  let formattedItems = formatItems(items);
  let detailedItems = buildDetailedItems(formattedItems, loadAllItems());
  let promotedItems = buildPromotedItems(detailedItems, loadPromotions());
  let totalPrices = calculateTotalPrices(promotedItems);
  let receipt = buildReceipt(promotedItems, totalPrices);
  let lines = buildReceiptString(receipt);

  return lines;
}






















