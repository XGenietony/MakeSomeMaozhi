


import requests
import time
import random
import json


url = 'https://trade.jd.com/shopping/order/submitOrder.action'
# js function of submit order is included in https://trade.jd.com/shopping/misc/js/order.js?r=2018070403091

eid = "IEM4WPQZX2ZR5C7UHVRQ2SBS2QXPMZ5IHMZS3S2JMBYUQUVOVQCPQOJWD52PWUCE4CKMYTDQ6FIEF6KCWMOG33HDCI"
fp = "4924974fdca5f8115d5ed42bc2fb592e"
track_id = "1XythvVixHRl0__CxCY1o9Oj9XZeWbjRu_3reSKOnDHsRePd0eZAsq2GrcvUr9NfgLyu3HO5sDDZbPmajc2b"
risk_control = 0

data = {
    'overseaPurchaseCookies': '',
    'vendorRemarks': '[]',
    'submitOrderParam.sopNotPutInvoice': 'false',
    'submitOrderParam.trackID': 'TestTrackId',
    'submitOrderParam.ignorePriceChange': '0',
    'submitOrderParam.btSupport': '0',
    'riskControl': 0,
    'submitOrderParam.isBestCoupon': 1,
    'submitOrderParam.jxj': 1,
    'submitOrderParam.trackId': track_id,  # Todo: need to get trackId
    # 'submitOrderParam.eid': eid,
    # 'submitOrderParam.fp': fp,
    'submitOrderParam.needCheck': 1,
}

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    'Host': 'trade.jd.com',
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
    'Referer': 'http://trade.jd.com/shopping/order/getOrderInfo.action',
    "Connection": "keep-alive"
}


sess = requests.session()
resp = sess.post(url=url, data=data, headers=headers)
resp_json = json.loads(resp.text)
print(resp, "\n", resp_json)
