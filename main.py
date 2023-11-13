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
    sku_ids = '1163743'  # 商品id
    area = '15_1213_3411_52667'  # 区域id 杭州西湖区
    cookie = "flash=2_uDjQ54WYofJSjqVj5tj-tL_j0elAIg48bu5hskQH4ApjDNlmhs9wDMcR5lSEsSMgIZOPGLp1BeVHVrD4B2JZ2s4JOaa1TlBTiSOwATIaGss*; thor=3083BE905D150F1ABC9DB616A159627A69248FA392D1E4C5D149E8446BBD2149A34EAA833BBB6629764AFDBE9C4ABC2DFF05920D357F0AE1E3584843A32AADFE937915A573398FA9AC0178F76CAC58F5789B038A27A1CF76C79021BE6E98882022B18302A04F72AF754190F7003D6ECE2A10ADDE7CEC9C54C069938FC8AA9A6B59A8724EE9704A5055099093B7457990A495E8571D5220E084BB89E7B7A3B78F; pin=jd_74f592b51225a; unick=XGenie; 3AB9D23F7A4B3C9B=L3VN42OUNZA6Y7KXSMHIAK4HCCMV4MDHBAO74A4KDSPUK75BHTBNCFFYFXHLILMJQTZQZNS5INSOX2O64LK7RYETMI; shshshfpa=9860c781-e80e-286e-a609-d6654eb32195-1699622810; shshshfpx=9860c781-e80e-286e-a609-d6654eb32195-1699622810; __jdc=211550538; __jdv=211550538|direct|-|none|-|1699622810155; ipLoc-djd=15-1213-3038-59931; shshshsID=d3a7494b5dce5b71bc3e6db42ba4b726_1_1699625141060; 3AB9D23F7A4B3CSS=jdd03L3VN42OUNZA6Y7KXSMHIAK4HCCMV4MDHBAO74A4KDSPUK75BHTBNCFFYFXHLILMJQTZQZNS5INSOX2O64LK7RYETMIAAAAMLXGGYGVIAAAAADNU4TTKEGSBXCAX; _gia_d=1; __jda=211550538.1699622810154427293607.1699622810.1699622810.1699625141.2; __jdb=211550538.1.1699622810154427293607|2.1699625141; shshshfpb=AAsmDjbmLEmDHgegOKG6mCdZlTrMhlRaZYigQQgAAAAA"
    asst = Assistant(cookie)  # 初始化
    asst.login_by_QRcode()  # 扫码登陆
    asst.buy_item_in_stock(sku_ids=sku_ids, area=area, wait_all=False, stock_interval=2)  # 根据商品是否有货自动下单
    # asst.exec_reserve_seckill_by_time(sku_id=sku_ids, buy_time='2023-11-09 20:00:00.010', retry=10, interval=0.1, num=2)

    # asst.add_item_to_cart(sku_ids)

    # 6个参数：
    # sku_ids: 商品id。可以设置多个商品，也可以带数量，如：'1234' 或 '1234,5678' 或 '1234:2' 或 '1234:2,5678:3'
    # area: 地区id
    # wait_all: 是否等所有商品都有货才一起下单，可选参数，默认False
    # stock_interval: 查询库存时间间隔，可选参数，默认3秒
    # submit_retry: 提交订单失败后重试次数，可选参数，默认3次
    # submit_interval: 提交订单失败后重试时间间隔，可选参数，默认5秒
