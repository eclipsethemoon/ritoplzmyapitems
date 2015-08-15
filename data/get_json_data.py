import re
import requests
import time
import yaml

if __name__ == "__main__":
    with open('conf/application.yml', 'r') as f:
        config = yaml.load(f)

    patches = ['5.11', '5.14']
    match_types = ['NORMAL_5X5', 'RANKED_SOLO']
    regions = ['BR', 'EUNE', 'EUW', 'KR', 'LAN', 'LAS', 'NA', 'OCE', 'RU', 'TR']

    for patch in patches:
        for match in match_types:
            for region in regions:
                print('Current file: ' + '_'.join([region, match, patch]))
                f_json = open('json/' + '_'.join([region, match, patch]) + '.json', 'a')
                with open('/'.join([patch, match, region]) + '.json', 'r') as f_id:
                    for line in f_id:
                        match_id = re.search(r'[0-9]+', line)
                        if match_id is not None:
                            res = requests.get('https://' + region.lower() + '.api.pvp.net/api/lol/' + region.lower() +
                                               '/v2.2/match/' + match_id.group() + '?includeTimeline=true&api_key=' +
                                               config['dev_api_key'])
                            if res.status_code == 200:
                                f_json.write(res.content + "\n")
                                time.sleep(1.2)


