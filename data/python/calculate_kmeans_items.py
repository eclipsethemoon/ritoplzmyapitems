import json
import matplotlib.pyplot as plt
import numpy as np

from sklearn.cluster import KMeans
from sklearn.manifold import TSNE
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import scale

ap_items = map(str, [1026, 1052, 1058, 3001, 3003, 3023, 3025, 3027, 3041, 3057, 3060, 3078, 3089, 3100, 3108,
                     3113, 3115, 3116, 3124, 3135, 3136, 3145, 3146, 3151, 3152, 3157, 3165, 3174, 3191, 3285, 3504])
changed_ap_items = map(str, [3089, 3157, 3285, 3116, 3003, 3027, 3151, 3135, 3115, 3152, 3165, 3174])
champs = map(str, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
                   28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 48, 50, 51, 53, 54, 55, 56,
                   57, 58, 59, 60, 61, 62, 63, 64, 67, 68, 69, 72, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86,
                   89, 90, 91, 92, 96, 98, 99, 101, 102, 103, 104, 105, 106, 107, 110, 111, 112, 113, 114, 115, 117,
                   119, 120, 121, 122, 126, 127, 131, 133, 134, 143, 150, 154, 157, 161, 201, 222, 236, 238, 245,
                   254, 266, 267, 268, 412, 421, 429, 432])
relevant_data = ["winner", "pickRate", "TOP", "BOTTOM", "JUNGLE", "MIDDLE"]
tags = ['Assassin', 'Fighter', 'Mage', 'Marksman', 'Support', 'Tank']

np.random.seed(42)

# Read in the champion data using a random item file
with open('../3001.json', 'r') as f:
    champ_data = json.load(f)

# Create the data and transform it into a Numpy array
data_np = dict()
for champ in champs:
    with open('../' + champ + '.json', 'r') as f:
        champ_json = json.load(f)
        data_json = champ_json['stats'].copy()
        for tag in tags:
            if tag in champ_json['tags']:
                data_json[tag] = 1 / len(champ_json['tags'])
            else:
                data_json[tag] = 0
        for ap_item in ap_items:
            for feature in relevant_data:
                data_json[ap_item + feature] = champ_json[ap_item]['5.14'][feature]
    data_np[champ] = data_json.values()
data_array = np.array(data_np.values())
data = scale(data_array)

# Find the number of optimal clusters
range_n_clusters = [2, 3, 4, 5, 6, 7, 8]
n_cluster = 2
best_silhouette_score = 0
for n_clusters in range_n_clusters:
    kmeans_model = KMeans(init='k-means++', n_clusters=n_clusters, n_init=100, n_jobs=-1, max_iter=1000)
    cluster_labels = kmeans_model.fit_predict(data)
    silhouette_avg = silhouette_score(data, cluster_labels)
    print("For n_clusters =", n_clusters, "The average silhouette_score is :", silhouette_avg)
    if silhouette_avg > best_silhouette_score:
        n_cluster = n_clusters
        best_silhouette_score = silhouette_avg

# Run k-means with best number of clusters
kmeans_model = KMeans(init='k-means++', n_clusters=n_cluster, n_init=100, n_jobs=-1, max_iter=1000)
cluster_labels = kmeans_model.fit_predict(data)

champ_groups = dict()
for cluster in map(str, range(n_cluster)):
    champ_groups[cluster] = []
for idx, label in enumerate(kmeans_model.labels_):
    champ_groups[str(label)].append(champs[idx])

# Find the most winning items from the changed AP items and sort them
champion_items = dict()
for cluster in map(str, range(n_cluster)):
    champion_items[cluster] = dict()
    for ap_item in changed_ap_items:
        champion_items[cluster][ap_item] = 0
    for champ in champ_groups[cluster]:
        with open('../' + champ + '.json', 'r') as f:
            champ_json = json.load(f)
            for ap_item in changed_ap_items:
                champion_items[cluster][ap_item] += \
                    champ_json[ap_item]['5.14']['winner'] * champ_json[ap_item]['5.14']['pickRate']
    champion_items[cluster] = sorted(champion_items[cluster], key=champion_items[cluster].get, reverse=True)

# Write out the sorted list for each champion
output = dict()
for champ in champs:
    output[champ] = dict()
    for cluster in map(str, range(n_cluster)):
        if champ in champ_groups[cluster]:
            output[champ]['items'] = champion_items[cluster]
            output[champ]['champs'] = champ_groups[cluster]
            break
with open('../champions_recommended_items.json', 'w') as f:
    json.dump(output, f)

