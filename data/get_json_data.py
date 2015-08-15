import re

patches = ['5.11', '5.14']
match_types = ['NORMAL_5X5', 'RANKED_SOLO']
regions = ['BR', 'EUNE', 'EUW', 'KR', 'LAN', 'LAS', 'NA', 'OCE', 'RU', 'TR']

for patch in patches:
    for match in match_types:
        for region in regions:
            f_json = open('/'.join([patch, match, region]) + '_data.json', 'a')
            with open('/'.join([patch, match, region]) + '.json', 'r') as f_id:
                for line in f_id:
                    match_id = re.search(r'[0-9]+', line)
                    

