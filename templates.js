angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("detail/detail.html","<pageslide ps-side=\"left\" ps-cloak=\"false\" ps-open=\"checked\" ps-key-listener=\"true\" ps-size=\"350px\"><div><div class=\"championHeader\"><div class=\"icon\"><img src=\"http://ddragon.leagueoflegends.com/cdn/5.16.1/img/champion/{{championSelected.key}}.png \" alt=\"{{championSelected.name}}\"/></div><div class=\"content\"><span class=\"name\">{{championSelected.name}}</span><span class=\"title\">{{championSelected.title}}</span></div><div class=\"classes\"><div ng-repeat=\"tag in championSelected.tags\" class=\"tagsWrapper\"><img ng-src=\"{{ \'http://ddragon.leagueoflegends.com/cdn/5.16.1/img/profileicon/\' + championTags[tag] + \'.png\' }}\" height=\"30\" width=\"30\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"{{tag}}\"/></div></div></div><div class=\"championContentWrapper scroller\"><div class=\"championContent\"><h3>Most Common Items</h3><div class=\"categoryWrapper\"><div ng-repeat=\"(key, value) in most_common | limitTo: 3\" class=\"categoryItem\"><img ng-src=\"{{ \'http://ddragon.leagueoflegends.com/cdn/5.16.1/img/item/\' + value[\'item\'] + \'.png\' }}\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"{{value.name}}\"/><span>{{ value[\'pickRate\'] }}%</span></div><span>(By Purchase Rate)</span></div></div><div class=\"championContent\"><h3>Most Successful Items</h3><div class=\"categoryWrapper\"><div ng-repeat=\"(key, value) in most_winner | limitTo: 3\" class=\"categoryItem\"><img ng-src=\"{{ \'http://ddragon.leagueoflegends.com/cdn/5.16.1/img/item/\' + value[\'item\'] + \'.png\' }}\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"{{value.name}}\"/><span>{{ value[\'winner\'] }}%</span></div><span>(By Win Rate)</span></div></div><div class=\"championContent\"><h3>Recommended Items</h3><div class=\"categoryWrapper\"><div ng-repeat=\"(key, value) in recommended | limitTo: 3\" class=\"categoryItem\"><img ng-src=\"{{ \'http://ddragon.leagueoflegends.com/cdn/5.16.1/img/item/\' + value[\'item\'] + \'.png\' }}\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"{{value.name}}\"/><span>{{ value[\'winner\'] }}%</span></div><span>(By Win Rate)</span></div></div><div class=\"championContent\"><h3>Item Composition</h3><d3-donut data=\"item_types\"></d3-donut></div></div></div></pageslide>");
$templateCache.put("info/info.html","<div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" ng-click=\"cancel()\" class=\"close\">×</button><h4 class=\"modal-title\">Rito Plz! My AP Items!</h4></div><div class=\"modal-body\"><p>This website looks into how the AP (ability power) item changes in Patch 5.13 have affected games. If you\'re looking for how the patch changes have affected a certain champion or AP items, we can help!</p><br/><p>Without selecting a champion, we show how the patch has affected each AP item. We also take a look at some questions that were asked when the patch first came out.</p><p>If you select a champion, we\'ll tell you how each AP item relates to you now. We also give you some recommendations based on similar champions along with items that you\'ll most likely find on your champion or items that win you games.</p><accordion close-others=\"false\"><accordion-group heading=\"How did you calculate these numbers? These numbers seem strange...\"><p>To get our data, we downloaded the list of match ids in the second category of the Riot API Challenge (<a>https://developer.riotgames.com/discussion/announcements/show/2lxEyIcE</a>). We made REST calls on each match id to get information for 375,740 matches. Although this is less than the expected 400k matches, this is a large enough dataset to do our analysis.</p><p>After getting the raw data, we did a whole of mapping and averaged between the groups to get the data. The terms you see are usually the average, but we should clarify the pick rate and win rate. Note that \'item\' is only the first instance of the \'item\' (e.g. Only one Deathcap is counted if player has bought two Deathcaps in a game).</p><ul><li>Pick rate = || item || / || number of champions in the dataset ||</li><li>Pick rate(champion) = || item || / || number of times the champion is played ||</li><li>Win rate = || item in a winning game || / || item ||</li><li>Win rate(champion) = || item on champion in a winning game || / || item on champion ||</li></ul><p>The code to perform these calculations are located in <a>https://github.com/issenec/ritoplzmyapitems/tree/gh-pages/data/python</a>. We\'re pretty confident in our calculations, but if you\'re certain about a mistake, feel free to open a ticket in Github (<a>https://github.com/issenec/ritoplzmyapitems</a>) and we\'ll take a look!</p></accordion-group><accordion-group heading=\"How did you come up with the Recommended Items? Machine learning?\"><p>We took motivation from last year\'s Riot API Challenge winner: <a>http://urf.microtony.com/</a>. They did a fantastic study of how the role of each champion changed in URF mode. Shout-outs to their great work!</p><p>Looking at the AP item changes, there should have been one question on every player\'s mind: What new items can I try? We can say \'It makes sense for Azir to get Nashor\'s Tooth\', but it doesn\'t mean much if we can\'t back it up with data. We can take a look at what items were the most common or were involved in the most winning matches, but that doesn\'t help in trying new items that are not in meta. Thus, we decided to use machine learning to get other items to recommend for each champion.</p><p>There were several clustering models that we considered: K-means, Gaussian Mixture Models (GMM), or a deep restricted Boltzmann machine (RBM). RBMs would have been great to use: start with the champion picked in a match, throw in all data for each champion in each match with all the features, let it run through several layers, and connect it to a final layer comprised of items picked. Then, once the model is trained, you would get recommended items for every champion. However, my computer is not currently set up for GPU processing (Looking at you and your drivers for Fedora, Nvidia!) and RBMs would take too long to train.</p><p>As a result, we had to choose between K-means and GMMs. We were more familiar with K-means so we chose that model to group champions together and use the items used in that group of champions as recommended items. The features used to group the champions included the champion base and growth stats, tags (e.g. is the champion an assassin?), and some AP item stats (winrate, pickrate, and lane) related to the champion. The data generated can be seen in lines 30-43 at <a>https://github.com/issenec/ritoplzmyapitems/blob/gh-pages/data/python/calculate_kmeans_items.py</a>.</p><p>The modeling package we used was scikit-learn. We chose this since it\'s a prevalent library used in the Python machine learning community. We considered PySpark, but scikit-learn has more visualization and niche functions and we weren\'t using a cluster to process the data (where Spark really shines). After generating the data, we fitted a KMeans model on it and ended up with 4 groups of champions as this number of groups resulted in the lowest silhouette score (<a>http://scikit-learn.org/stable/auto_examples/cluster/plot_kmeans_silhouette_analysis.html</a>). As a sanity check, we also threw the data into T-SNE (<a>http://scikit-learn.org/stable/modules/generated/sklearn.manifold.TSNE.html</a>), a manifold visualization tool which groups data. The resulting T-SNE plot is shown below:</p><img src=\"images/tsne.png\" width=\"90%\"/><p>From looking at the plot, it seems 4 clusters is possible since you could see between 3-6 clusters, depending on how tightly you couple the data points. Now that we have our groups of champions, for each group, we gather the items and sort them by the number of times the item was used in a winning match. This results in the following recommended items for each group:</p><table><thead><tr><th style=\"width: 50%\">Champions</th><th style=\"width: 50%\">Recommended Items (Most -> Least)</th></tr></thead><tbody><tr ng-repeat=\"item in items\"><td class=\"champions-group\"><img ng-repeat=\"champ in item[\'champs\']\" ng-src=\"{{ \'http://ddragon.leagueoflegends.com/cdn/5.16.1/img/champion/\' + champIds[champ] + \'.png\' }}\" height=\"30\" width=\"30\"/></td><td class=\"recommended-items\"><img ng-repeat=\"i in item[\'items\']\" ng-src=\"{{ \'http://ddragon.leagueoflegends.com/cdn/5.16.1/img/item/\' + i + \'.png\' }}\" height=\"30\" width=\"30\"/></td></tr></tbody></table><p>Looking at this, for the most part, the main items of Rabadon\'s Deathcap and Zhonya\'s Hourglass still hold true. However, for the last group of champions, it seems Rod of Ages and Will of the Ancients may be something worth experimenting with.</p><p>Sidenote: The statement about Azir and Nashor\'s Tooth: It turns out that although the pick rate increased, the winrate did not.</p></accordion-group><accordion-group heading=\"Why is there a section specifically for Nashor\'s tooth, etc.?\"><p>When the AP items patch (5.13) came out, there seemed to be more utility to each AP items, but it was all theoretical. A lot of questions came up in the patch notes and in the forums, but four questions really stood out:</p><ul><li>Early Nashor\'s tooth\'s attack speed to ability power ratio meant the item only made sense on certain champions: only Kayle. Does the new Nashor\'s tooth just as niche?</li><li>Do you heal more from the new Will of the Ancients?</li><li>Watching LCS, Kog\'maw was scary if he got both Rylai\'s Crystal Scepter and Liandry\'s Torment. How insane is the synergy between the two items?</li><li>To quote Pwyff and Scarizard: \"[...] Picking up a Codex + Book on your first back can be about comparable to going for that 1200 gold NLR. ARE THESE CHOICES MEANINGFUL? You tell us.\"</li></ul><p>These questions were very interesting and would vary for each champion. So we decided to give them their own section.</p></accordion-group><accordion-group heading=\"Why do we see non-AP champs (e.g. Jinx)?\"><!-- TODO: Consider putting a row of non-AP champion icons here--><p>We don\'t judge your choice of champions. Personally, you\'re a little too spicy for us, but if you want to do an AP Jinx, go for it! Don\'t let your dreams be dreams!</p></accordion-group><accordion-group heading=\"Where is Seraph\'s Embrace? What about other AP items?\"><!-- TODO: Consider putting a picture of Seraph\'s Embrace here--><p>Seraph\'s Embrace is special because you automatically get this item once you cast your spells after a certain amount. As a result, we can look at the statistics for Seraph\'s Embrace by looking at its base item: Archangel\'s Staff. In the future, we will want to look at the statistics when Seraph\'s Embrace is completed versus when it is not. However, we chose to ignore Seraph\'s Embrace since the only change was +20 ability power, but the path to get there was the same after you got Archangel\'s Staff.</p></accordion-group><accordion-group heading=\"Any improvements you plan on making?\"><p>There\'s definitely tons of things we can do. As mentioned in the previous section, one potential addition would be statistics for Seraph\'s Embrace.</p><p>Another useful addition would be statistics for item combinations. We chose to ignore this because item purchase order would add some data complexity. This wouldn\'t be impossible: we have access to computers that can handle the data. However, due to the time constraints of this API challenge, we opted to do this analysis in the future.</p><p>In terms of the current data, we could and probably should have filtered based on leagues or the number of games recorded for a champion-item combo. There were games where the combination was \"spicy\" (looking at you AP Jinx players). However, it\'s a little interesting to see picks for non-AP champions so we did not do this filtering despite the possibility that our app would be more useful without the \"spicy\" games.</p><p>One interesting possibility is to look at each region. We were given access to data separated by regions. We chose not to take this into account, but it would be fun to see the meta across each region.</p><p>Finally, if we were given ARAM (All-Random-All-Mid) data, we would love to do our analysis on it. How many times have you gone first-item Needlessly Large Rod?</p></accordion-group></accordion></div></div>");
$templateCache.put("main/championTemplate.html","<a><img ng-src=\"http://ddragon.leagueoflegends.com/cdn/5.16.1/img/champion/{{match.model.key}}.png\" width=\"16\"/><span bind-html-unsafe=\"match.label | typeaheadHighlight:query\"></span></a>");
$templateCache.put("main/main.html","<header><h1>RitoPlz! My AP Items for</h1><input type=\"text\" ng-model=\"championSelected\" placeholder=\"Champions\" typeahead=\"champion as champion.name for champion in champions | filter:{name:$viewValue}\" typeahead-template-url=\"main/championTemplate.html\" class=\"form-control\"/><ul class=\"nav navbar-nav navbar-right\"><button ng-click=\"open()\" ng-controller=\"InfoCtrl\" class=\"btn\"><span class=\"glyphicon glyphicon-circle-info\"></span> Info</button></ul></header><div class=\"container-fluid\"><div class=\"row\"><div class=\"col-sm-3 col-md-3 col-lg-3 sidebar\"><div ng-include=\" \'detail/detail.html\' \" ng-controller=\"DetailCtrl\" class=\"sidePane\"></div></div><div ng-include=\" \'scatter/scatter.html\' \" ng-controller=\"ScatterCtrl\" class=\"row\"></div><div ng-include=\" \'showcase/showcase.html\' \" ng-controller=\"ShowcaseCtrl\" class=\"row\"></div></div></div>");
$templateCache.put("scatter/scatter.html","<div class=\"chartContainer\"><div class=\"chartBackground\"></div><div class=\"chartArea\"><div class=\"chartTitle\"><h2><b>Changes in statistics after the AP item patch</b></h2></div><d3-scatter data=\"apItems\" filter=\"filterRadio\" pushed=\"champFocus\"></d3-scatter><div class=\"btn-group ng-scope fillCenter floatright\"><label ng-model=\"filterRadio\" btn-radio=\"\'winner\'\" class=\"btn btn-primary ng-pristine ng-untouched ng-valid active\">Win Rate %</label><label ng-model=\"filterRadio\" btn-radio=\"\'pickRate\'\" class=\"btn btn-primary ng-pristine ng-untouched ng-valid\">Pick Rate %</label><label ng-model=\"filterRadio\" btn-radio=\"\'timestamp\'\" class=\"btn btn-primary ng-pristine ng-untouched ng-valid\">Time Completed (min)</label></div></div></div>");
$templateCache.put("showcase/showcase.html","<div class=\"spotlightSection\"><div class=\"spotlightWrapper\"><h1><b>Showcase Items</b></h1><div class=\"content\"><div class=\"cell\"><div class=\"title\">Nashor\'s Tooth</div><p>Before the AP item change patch (5.13), there was a limited number of viable carriers for Nashor\'s Tooth.\nIs this still the case or have the changes to the item opened up more variety? Has this\nitem found its own niche?</p><br/><blockquote>[W]hile it\'s always been a great pickup for auto-attacking mages, that attack speed to ability power ratio meant you had to be pretty invested in your on-hit procs to even consider the Tooth. We\'re hoping this change will make it a little more enticing as a niche pickup for people not... Kayle.<cite>Riot in<a href=\"http://na.leagueoflegends.com/en/news/game-updates/patch/patch-513-notes\">Patch 5.13 Notes</a></cite></blockquote></div><div class=\"cell\"><center><img src=\"http://ddragon.leagueoflegends.com/cdn/5.2.1/img/item/3115.png\"/></center><table class=\"table table-condensed\"><tr><td>Pick Rate</td><td>{{ nashor[\'pickRate\'] }}% (<span ng-if=\"nashor[\'pickDiff\'] &gt; 0\">+</span>{{ nashor[\'pickDiff\'] }}%<i ng-class=\"{\'glyphicon-menu-up green\': nashor[\'pickDiff\'] &gt; 0, \'glyphicon glyphicon-menu-down red\': nashor[\'pickDiff\'] &lt; 0}\" class=\"glyphicon\"></i>)</td></tr><tr><td>Win Rate</td><td>{{ nashor[\'winner\'] }}% (<span ng-if=\"nashor[\'winDiff\'] &gt; 0\">+</span>{{ nashor[\'winDiff\'] }}%<i ng-class=\"{\'glyphicon-menu-up green\': nashor[\'winDiff\'] &gt; 0, \'glyphicon glyphicon-menu-down red\': nashor[\'winDiff\'] &lt; 0}\" class=\"glyphicon\"></i>)</td></tr></table></div></div></div><div class=\"spotlightWrapper hideMe\"><div class=\"content\"><div class=\"cell\"><div class=\"title\">Will of the Ancients</div><p>Will of the Ancients was changed so it no longer has spell vamp, but you heal for 15% of the damage dealt,\ncalculated before your opponent\'s resistances. While this is a minor nerf to killing minions, it is a buff\nagainst champions with ~50 MR. How do these changes balance out? Is it worth purchasing?</p><br/><blockquote>This means you\'ll be spell vamping for less, but you won\'t need as much (high base damage, resistance penetration, etc) to get your heal ball rolling.<cite>Riot in<a href=\"http://na.leagueoflegends.com/en/news/game-updates/patch/patch-513-notes\">Patch 5.13 Notes</a></cite></blockquote></div><div class=\"cell\"><center><img src=\"http://ddragon.leagueoflegends.com/cdn/5.2.1/img/item/3152.png\"/></center><table class=\"table table-condensed\"><tr><td>Pick Rate</td><td>{{ wota[\'pickRate\'] }}% (<span ng-if=\"wota[\'pickDiff\'] &gt; 0\">+</span>{{ wota[\'pickDiff\'] }}%<i ng-class=\"{\'glyphicon-menu-up green\': wota[\'pickDiff\'] &gt; 0, \'glyphicon glyphicon-menu-down red\': wota[\'pickDiff\'] &lt; 0}\" class=\"glyphicon\"></i>)</td></tr><tr><td>Win Rate</td><td>{{ wota[\'winner\'] }}% (<span ng-if=\"wota[\'winDiff\'] &gt; 0\">+</span>{{ wota[\'winDiff\'] }}%<i ng-class=\"{\'glyphicon-menu-up green\': wota[\'winDiff\'] &gt; 0, \'glyphicon glyphicon-menu-down red\': wota[\'winDiff\'] &lt; 0}\" class=\"glyphicon\"></i>)</td></tr><tr><td>Change in Heals</td><td>{{ wota[\'heal\'] }}% (<span ng-if=\"wota[\'healDiff\'] &gt; 0\">+</span>{{ wota[\'healDiff\'] }}%<i ng-class=\"{\'glyphicon-menu-up green\': wota[\'healDiff\'] &gt; 0, \'glyphicon glyphicon-menu-down red\': wota[\'healDiff\'] &lt; 0}\" class=\"glyphicon\"></i>)</td></tr></table></div></div></div><div class=\"spotlightWrapper hideMe\"><div class=\"content\"><div class=\"cell\"><div class=\"title\">Rylai\'s and Liandry\'s</div><p>Rylai\'s: the new permaslow.\nThe synergy is real here... or is it only for Kog\'maw?</p><br/><blockquote><p>With just the Liandry\'s under a champion\'s belt, any damage-over-time effects deal their normal damage plus 2% of a target\'s current health per second. But when that target is under a movement-impairing effect, that damage is doubled. Can you guess what grants all area of effect spells the ability to impair movement? That\'s right, Rylai\'s Crystal Scepter.</p><p>The combination of the two is downright brutal on just about any mage with big AOE spells that happen to apply a DoT.</p><cite>Taylor \"Riot RoboTayCo\" Cocke in<a href=\"http://na.lolesports.com/articles/magical-ap-item-changes-unicorns-love\">The Magical AP Item Changes with the Unicorns of Love</a></cite></blockquote></div><div class=\"cell\"><center><img src=\"http://ddragon.leagueoflegends.com/cdn/5.2.1/img/item/3116.png\"/><img src=\"http://ddragon.leagueoflegends.com/cdn/5.2.1/img/item/3151.png\"/></center><table class=\"table table-condensed\"><tr><td>Pick Rate</td><td>{{ rylaiLiandry[\'pickRate\'] }}% (<span ng-if=\"rylaiLiandry[\'pickDiff\'] &gt; 0\">+</span>{{ rylaiLiandry[\'pickDiff\'] }}%<i ng-class=\"{\'glyphicon-menu-up green\': rylaiLiandry[\'pickDiff\'] &gt; 0, \'glyphicon glyphicon-menu-down red\': rylaiLiandry[\'pickDiff\'] &lt; 0}\" class=\"glyphicon\"></i>)</td></tr><tr><td>Win Rate</td><td>{{ rylaiLiandry[\'winner\'] }}% (<span ng-if=\"rylaiLiandry[\'winDiff\'] &gt; 0\">+</span>{{ rylaiLiandry[\'winDiff\'] }}%<i ng-class=\"{\'glyphicon-menu-up green\': rylaiLiandry[\'winDiff\'] &gt; 0, \'glyphicon glyphicon-menu-down red\': rylaiLiandry[\'winDiff\'] &lt; 0}\" class=\"glyphicon\"></i>)</td></tr><tr><td>Change in Damage</td><td>{{ rylaiLiandry[\'magicDmg\'] }}% (<span ng-if=\"rylaiLiandry[\'magicDmgDiff\'] &gt; 0\">+</span>{{ rylaiLiandry[\'magicDmgDiff\'] }}%<i ng-class=\"{\'glyphicon-menu-up green\': rylaiLiandry[\'magicDmgDiff\'] &gt; 0, \'glyphicon glyphicon-menu-down red\': rylaiLiandry[\'magicDmgDiff\'] &lt; 0}\" class=\"glyphicon\"></i>)</td></tr><tr><td>Change in Crowd Control</td><td>{{ rylaiLiandry[\'crowdControl\'] }}% (<span ng-if=\"rylaiLiandry[\'crowdControlDiff\'] &gt; 0\">+</span>{{ rylaiLiandry[\'crowdControlDiff\'] }}%<i ng-class=\"{\'glyphicon-menu-up green\': rylaiLiandry[\'crowdControlDiff\'] &gt; 0, \'glyphicon glyphicon-menu-down red\': rylaiLiandry[\'crowdControlDiff\'] &lt; 0}\" class=\"glyphicon\"></i>)</td></tr></table></div></div></div><div class=\"spotlightWrapper hideMe\"><div style=\"z-index: 700\" class=\"content\"><div style=\"padding-right: 0px\" class=\"cell\"><div class=\"title\">NLR vs. Fiendish Codex</div><p>5.13 reduced the cost and effectiveness of the Needlessly Large Rod (NLR). Now, a set of the Codex + Book are comparable to the NLR.</p><br/><blockquote style=\"position: relative; left: -20px\">Super high level challenge: right now, AP mages bring a mix of damage and utility in their kits, but standard item builds have pretty much centered on more damage instead of getting more utility or reacting to the situation... Ultimately we want to offer more choices for more mages throughout the game, and we\'re doing this by bringing a little parity to the ability power board.<cite>Riot in<a href=\"http://na.leagueoflegends.com/en/news/game-updates/patch/patch-513-notes\">Patch 5.13 Notes</a></cite></blockquote></div><div style=\"padding-left:20px\" class=\"cell\"><table><th></th><th><img src=\"http://ddragon.leagueoflegends.com/cdn/5.7.1/img/item/1058.png\"/></th><th><img src=\"http://ddragon.leagueoflegends.com/cdn/5.7.1/img/item/3108.png\"/> +<img src=\"http://ddragon.leagueoflegends.com/cdn/5.7.1/img/item/1052.png\"/></th><tr><td><b>Cost</b></td><td>1250</td><td>1255 (820 + 435)</td></tr><tr><td><b>Stats</b></td><td>+60 ability power</td><td>+50 ability power<br/>+10% cooldown reduction</td></tr><tr><td><b>Pick Rate</b></td><td>{{ nlr[\'pickRate\'] }}% ({{ nlr[\'pickDiff\'] }}%<i ng-class=\"{\'glyphicon-menu-up green\': nlr[\'pickDiff\'] &gt; 0, \'glyphicon glyphicon-menu-down red\': nlr[\'pickDiff\'] &lt; 0}\" class=\"glyphicon\"></i>                                        )</td><td>{{ fiendish[\'pickRate\'] }}% (<span ng-if=\"fiendish[\'pickDiff\'] &gt; 0\">+</span>{{ fiendish[\'pickDiff\'] }}%<i ng-class=\"{\'glyphicon-menu-up green\': fiendish[\'pickDiff\'] &gt; 0, \'glyphicon glyphicon-menu-down red\': fiendish[\'pickDiff\'] &lt; 0}\" class=\"glyphicon\"></i>                                        )</td></tr><tr><td><b>Wins</b></td><td>{{ nlr[\'winner\'] }}% (<span ng-if=\"fiendish[\'winDiff\'] &gt; 0\">+</span>{{ nlr[\'winDiff\'] }}%<i ng-class=\"{\'glyphicon-menu-up green\': nlr[\'winDiff\'] &gt; 0, \'glyphicon glyphicon-menu-down red\': nlr[\'winDiff\'] &lt; 0}\" class=\"glyphicon\"></i>                                        )</td><td>{{ fiendish[\'winner\'] }}% ({{ fiendish[\'winDiff\'] }}%<i ng-class=\"{\'glyphicon-menu-up green\': fiendish[\'winDiff\'] &gt; 0, \'glyphicon glyphicon-menu-down red\': fiendish[\'winDiff\'] &lt; 0}\" class=\"glyphicon\"></i>                                        )</td></tr><tr><td><b>Acquisition Time</b></td><td>{{ nlr[\'timestamp\'] }} ({{ nlr[\'timestampDiff\'] }}<i ng-class=\"{\'glyphicon-menu-up green\': nlr[\'timestampDiff\'] &gt; 0, \'glyphicon glyphicon-menu-down red\': nlr[\'timestampDiff\'] &lt; 0}\" class=\"glyphicon\"></i>                                        )</td><td>{{ fiendish[\'timestamp\'] }} ({{ fiendish[\'timestampDiff\'] }}<i ng-class=\"{\'glyphicon-menu-up green\': fiendish[\'timestampDiff\'] &gt; 0, \'glyphicon glyphicon-menu-down red\': fiendish[\'timestampDiff\'] &lt; 0}\" class=\"glyphicon\"></i>                                        )</td></tr><tr><td><b>Builds Into</b></td><td><img src=\"http://ddragon.leagueoflegends.com/cdn/5.7.1/img/item/3003.png\" height=\"40\" width=\"40\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Archangel\'s Staff\"/><img src=\"http://ddragon.leagueoflegends.com/cdn/5.7.1/img/item/3089.png\" height=\"40\" width=\"40\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Rabadon\'s Deathcap\"/><img src=\"http://ddragon.leagueoflegends.com/cdn/5.7.1/img/item/3116.png\" height=\"40\" width=\"40\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Rylai\'s Crystal Scepter\"/><img src=\"http://ddragon.leagueoflegends.com/cdn/5.7.1/img/item/3157.png\" height=\"40\" width=\"40\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Zhonya\'s Hourglass\"/><img src=\"http://ddragon.leagueoflegends.com/cdn/5.7.1/img/item/3285.png\" height=\"40\" width=\"40\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Luden\'s Echo\"/></td><td><img src=\"http://ddragon.leagueoflegends.com/cdn/5.7.1/img/item/3174.png\" height=\"40\" width=\"40\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Athene\'s Unholy Grail\"/><img src=\"http://ddragon.leagueoflegends.com/cdn/5.7.1/img/item/3165.png\" height=\"40\" width=\"40\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Morellonomicon\"/><img src=\"http://ddragon.leagueoflegends.com/cdn/5.7.1/img/item/3023.png\" height=\"40\" width=\"40\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Twin Shadows\"/><img src=\"http://ddragon.leagueoflegends.com/cdn/5.7.1/img/item/3152.png\" height=\"40\" width=\"40\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Will of the Ancients\"/></td></tr></table></div></div></div></div>");}]);