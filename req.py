


import requests
import time
import random


# url = "https://api.m.jd.com/stocks?callback=jQuery3170763&type=getstocks&skuIds=100067981596&area=15_1213_3411_59343&appid=item-v3&functionId=pc_stocks&_=1699362499527"
url = "https://api.m.jd.com/stocks?type=getstocks&skuIds=100067981596&area=15_1213_3411_59343&appid=item-v3&functionId=pc_stocks&_=1699362499527"


# url = "https://api.m.jd.com/stocks?callback=jQuery3170763&type=getstocks&skuIds=100005557808&area=15_1213_3411_59343&appid=item-v3&functionId=pc_stocks&_=1699362499527"

# url = "https://api.m.jd.com/stocks?callback=jQuery3170763&type=getstocks&skuIds=1875996%2C1875992%2C1887526%2C1887518%2C3554966%2C5456164%2C100006143542%2C100009087641%2C2217750%2C2217746%2C3024767%2C6201910%2C100005557808%2C100011409952%2C1315806%2C1315798%2C4310952%2C100000384093%2C100005388628%2C100004120063%2C100005094382%2C100005094380%2C100005094374%2C100005094358%2C100006406439%2C100011610786%2C100006406367%2C100011610810%2C100059483564%2C100010373462%2C100010373450%2C100011975503%2C100059818743&area=15_1213_3411_59343&appid=item-v3&functionId=pc_stocks&_=1699362499527"

# url = "106.39.166.88:443"

## zf = 100067981596    venor = 1000000883

# url = "https://api.m.jd.com/stocks"
# url = "https://api.m.jd.com/stocks?callback=jQuery4438576&type=getstocks&skuIds=100009073095%2C100016027934%2C100067981596%2C100067981608&area=15_1213_3411_59343&appid=item-v3&functionId=pc_stocks&_=1699365299969"

sku_id = '100067981596'  # 商品id
area_id = '15_1213_3411_52667'  # 区域id

headers = {
    "Accept-Encoding": "gzip",
    "Connection": "close",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Referer": "https://item.jd.com/",
    "Origin": "https://item.jd.com/",
    "cookie": '__jdu=869693660; areaId=15; shshshfpa=6dee1ad2-6f69-0713-9f86-f2ada80801f0-1698983694; shshshfpx=6dee1ad2-6f69-0713-9f86-f2ada80801f0-1698983694; pinId=Kj7Sa5Loi8xzZQwuISQjkLV9-x-f3wj7; pin=jd_74f592b51225a; unick=XGenie; _tp=6SfjTHVcSi2QhPdafLXERbFVFznAYo4mzKv8ohJG0eQ%3D; _pst=jd_74f592b51225a; user-key=b38a6770-1cb9-4748-9098-585632669e24; mt_xid=V2_52007VwoVWlpQUF0YSClcDDBRFQFUXE4IHEsRQAAzURVOVVtXXgMbTl0HM1MVBglRUVwvShhfB3sDEk5cX0NaG0IbVA5kBCJQbVhiWh1IGF4HYgMRVl1oV1sWTw%3D%3D; ipLoc-djd=15-1213-3411-59343.4818261545; ipLocation=%u6d59%u6c5f; ceshi3.com=201; TARGET_UNIT=bjcenter; unpl=JF8EAK5nNSttWk0BVx8LEhIYHFRVW1pYTUdUO2VXXFlbTAENSQYTF0V7XlVdXxRLFx9uYRRUW1NOVA4bBysSEXteXVdZDEsWC2tXVgQFDQ8VXURJQlZAFDNVCV9dSRZRZjJWBFtdT1xWSAYYRRMfDlAKDlhCR1FpMjVkXlh7VAQrCxwaF0NfU1lcOEonBF9XNVRYXEJdASsDKxMgCQkIW1QOShAGIm4CXFpQSVMCGjIaIhM; autoOpenApp_downCloseDate_jd_homePage=1699366286208_1; source=PC; platform=pc; lpkLoginType=3; JSESSIONID=BEF0387661FC559BAD4F65AC9FD89472.s1; cn=45; qid_uid=72085b75-07c5-41eb-8974-a3b5e0732794; qid_fs=1699415537055; _distM=285206640865; __jdv=91748099|baidu|-|organic|notset|1699415895460; qid_ls=1699415537062; qid_ts=1699421393564; qid_vis=2; mba_muid=869693660; wlfstk_smdl=qrpq0b1ank3naxatx7vu71nd5txfbxj1; TrackID=12sKC-0i0-ioCLjjU-PDn75Y8ud__4H7DkgPALBgzP0_s61VPYHLIM4tFmShwstdh0UsQnyNAwD-GZx-ivPu6nMOveloWn-4nVHrwIYcrxUE; thor=3083BE905D150F1ABC9DB616A159627A69248FA392D1E4C5D149E8446BBD2149A9F58B022E2AD2B5F8AB40D4B9B817141F329C2D29055805C714D4F9153635A4D657CD239FA44832C3A08446D7A1F0D158E9CA1BF72E92AC73E50D0A417F9757B0B10889420518A76335A9DBE343D0A2EF1558409E8E31FE4C7F905B249F26593A7F2E7915EE0BA154BA083E19FF012218BF9722E561EBBD43E81C626A529ADE; flash=2_7YusNFf1BWk1kzfUEVUNFrp20CdnSKhKnc_Up6a6V8pIN2nd2oSrXeY9_E43POY9Tb0G2BYZ8teEm8lWwCc7Uq1NDU3vxq8pRNKOJPsoSXM*; 3AB9D23F7A4B3C9B=IEM4WPQZX2ZR5C7UHVRQ2SBS2QXPMZ5IHMZS3S2JMBYUQUVOVQCPQOJWD52PWUCE4CKMYTDQ6FIEF6KCWMOG33HDCI; __jdc=122270672; token=0b79b211da72aa248a26b0ac792fee50,3,944161; jsavif=1; 3AB9D23F7A4B3CSS=jdd03IEM4WPQZX2ZR5C7UHVRQ2SBS2QXPMZ5IHMZS3S2JMBYUQUVOVQCPQOJWD52PWUCE4CKMYTDQ6FIEF6KCWMOG33HDCIAAAAMLWGIT3QQAAAAACIYYPATCJ5R2JAX; _gia_d=1; __jda=122270672.869693660.1698983693.1699453873.1699491169.19; shshshsID=d43377bb1cc706a34b812bfae9a834a7_2_1699491188682; shshshfpb=AAoKMkbGLEu4a0m9pBxOfhvKtqAgB8BaYmDaUfwAAAAA; __jdb=122270672.2.869693660|19.1699491169'
}

payload = {
            # 'skuId': 100067981596,
            
            # 'callback': 'jQuery{}'.format(random.randint(1000000, 9999999)),
            'type': 'getstocks',
            'skuId': sku_id,
            # 'buyNum': 1,
            'area': '15_1213_3411_52667',
            # 'ch': 1,
            '_': str(int(time.time() * 1000)),
            'extraParam': '{"originid":"1"}',  # get error stock state without this param
            'cat': 0,  # get 403 Forbidden without this param (obtained from the detail page)
            'venderId': 1000000883,  # return seller information with this param (can't be ignored)
            'functionId': 'pc_stocks',
            'appid': 'item-v3'
        }

##callback: jQuery3170763
# type: getstocks
# skuIds: 1875996,1875992,1887526,1887518,3554966,5456164,100006143542,100009087641,2217750,2217746,3024767,6201910,100005557808,100011409952,1315806,1315798,4310952,100000384093,100005388628,100004120063,100005094382,100005094380,100005094374,100005094358,100006406439,100011610786,100006406367,100011610810,100059483564,100010373462,100010373450,100011975503,100059818743
# area: 15_1213_3411_59343
# appid: item-v3
# functionId: pc_stocks
# _: 1699362499527



resp_text = requests.get(url=url, params=payload, headers=headers, timeout=10)
# resp_text = requests.get(url=url, params=payload, timeout=10)

# resp_text = requests.get(url)
data = resp_text.json()
stock_info = data.get(str(sku_id))
sku_state = stock_info.get('skuState')  # 商品是否上架
stock_state = stock_info.get('StockState')  # 商品库存状态：33 -- 现货  0,34 -- 无货  36 -- 采购中  40 -- 可配货
print(resp_text, "\n", resp_text.text, resp_text.content, resp_text.json())
