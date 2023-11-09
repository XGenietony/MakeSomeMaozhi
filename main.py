#!/usr/bin/env python
# -*- coding:utf-8 -*-
from jd_assistant import Assistant

if __name__ == '__main__':
    """
    重要提示：此处为示例代码之一，请移步下面的链接查看使用教程👇
    https://github.com/huaisha1224/jd-assistant/wiki/JD%E6%8A%A2%E8%B4%AD%E5%8A%A9%E6%89%8B
    """

    #茅台 100012043978
    #zf40套 100067981596
    sku_ids = '100012043978'  # 商品id
    area = '15_1213_3411_52667'  # 区域id
    asst = Assistant()  # 初始化
    asst.login_by_QRcode()  # 扫码登陆
    # asst.buy_item_in_stock(sku_ids=sku_ids, area=area, wait_all=False, stock_interval=2)  # 根据商品是否有货自动下单
    asst.exec_reserve_seckill_by_time(sku_id=sku_ids, buy_time='2023-11-09 20:00:00.010', retry=10, interval=0.1, num=2)

    # asst.add_item_to_cart(sku_ids)

    # 6个参数：
    # sku_ids: 商品id。可以设置多个商品，也可以带数量，如：'1234' 或 '1234,5678' 或 '1234:2' 或 '1234:2,5678:3'
    # area: 地区id
    # wait_all: 是否等所有商品都有货才一起下单，可选参数，默认False
    # stock_interval: 查询库存时间间隔，可选参数，默认3秒
    # submit_retry: 提交订单失败后重试次数，可选参数，默认3次
    # submit_interval: 提交订单失败后重试时间间隔，可选参数，默认5秒
