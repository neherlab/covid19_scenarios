import pandas as pd
import numpy as np
from .utils import store_data, stoi

# ------------------------------------------------------------------------
# Globals
cols = ['time', 'cases', 'deaths', 'hospitalized', 'icu', 'recovered']

# ------------------------------------------------------------------------
# Main point of entry

def parse():
    
    #Data extraction from source
    dataframe=pd.read_csv("https://raw.githubusercontent.com/kaz-ogiwara/covid19/master/data/prefectures.csv")
    
    #Translation from Japanese to English
    keys_dictionary={'年': 'year','月': 'month','日': 'day','都道府県': 'prefecture','患者数（2020年3月28日からは感染者数）': 'cases','現在は入院等': 'hospital','退院者': 'recovered','死亡者': 'deaths'}
    prefecture_dictionary={'北海道': 'Hokkaido', '愛知県': 'Aichi', '東京都': 'Tokyo', '大阪府': 'Osaka', '兵庫県': 'Hyogo', '神奈川県': 'Kanagawa', '埼玉県': 'Saitama', '千葉県': 'Chiba', '京都府': 'Kyoto', '新潟県': 'Niigata', '和歌山県': 'Wakayama', '高知県': 'Kochi', '群馬県': 'Gunma', '熊本県': 'Kumamoto', '石川県': 'Ishikawa', '三重県': 'Mie', '福岡県': 'Fukuoka', '奈良県': 'Nara', '滋賀県': 'Shiga', '岐阜県': 'Gifu', '栃木県': 'Tochigi', '沖縄県': 'Okinawa', '長野県': 'Nagano', '静岡県': 'Shizuoka', '宮崎県': 'Miyazaki', '愛媛県': 'Ehime', '茨城県': 'Ibaraki', '山梨県': 'Yamanashi', '福島県': 'Fukushima', '福井県': 'Fukui', '秋田県': 'Akita', '宮城県': 'Miyagi', '大分県': 'Oita', '山口県': 'Yamaguchi', '広島県': 'Hiroshima', '香川県': 'Kagawa', '佐賀県': 'Saga', '岡山県': 'Okayama', '青森県': 'Aomori', '長崎県': 'Nagasaki', '鹿児島県': 'Kagoshima', '徳島県': 'Tokushima', '富山県': 'Toyama', '山形県': 'Yamagata', '島根県': 'Shimane', '鳥取県': 'Tottori', '岩手県': 'Iwate'}
    
    dataframe=dataframe.rename(columns=keys_dictionary)
    dataframe=dataframe.replace(prefecture_dictionary)
    
    #Time format conversion
    time_format = '%Y-%m-%d'
    dataframe['date'] = pd.to_datetime(dataframe.year.astype(str)+'-'+dataframe.month.astype(str)+'-'+dataframe.day.astype(str), format=time_format) 
    
    #Separate by region 
    dummy=pd.get_dummies(dataframe['prefecture'])
    dataframe=pd.concat([dataframe,dummy],axis=1)
    regions_name=dataframe.iloc[:,9:].columns
    dataframe['icu']=None
    dataframe_region=dataframe[['date', 'cases', 'deaths', 'hospital', 'icu', 'recovered']].copy()
    dataframe_region['date']=dataframe_region['date'].astype(str)
    dataframe_region['deaths']=dataframe_region['deaths'].replace({'-': '0'})
    dataframe_region['deaths']=dataframe_region['deaths'].astype(int)

    region_tables = {}
    for region in regions_name:
        region_tables['-'.join(['JP',region])]  = dataframe_region[dataframe[region]==1].values.tolist()
    
    #All Japan cases
    dataframe_region['icu']=0
    japan_table=dataframe_region.groupby("date",as_index=False).sum()
    japan_table['icu']=None
    region_tables['Japan']=japan_table.values.tolist()
    store_data(region_tables, 'japan', cols)
    
    
    
    
    
    
    
