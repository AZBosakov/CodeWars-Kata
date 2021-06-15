#!/usr/bin/php
<?php
/**
 * USAGE:
 * ./README.md.php > README.md
 * 
 * NOTE to self:
 * If metadata format changed - delete cache file and recreate it
 */
?>
# Some of my sollutions to CodeWars Katas

<?php

const KATA_CACHE_FILE = './kata_cache.json';
const KATA_LINK_PREFIX = 'https://www.codewars.com/kata/';
const GH_FILE_LINK_MASTER_BR = './blob/master/';
const LINE_LINK_MATCH = '{^\s*//\s*('.KATA_LINK_PREFIX.'([^\s]*))}m';

const LANG_JS = 'JavaScript';

$files[LANG_JS] = glob('*.js');

// NOTE to self: If metadata format changed - delete this file and recreate it
$katas = file_exists(KATA_CACHE_FILE) ? (
    json_decode(file_get_contents(KATA_CACHE_FILE), true) ?? []
) : [];

function getMeta(string $id): array {
    $url = KATA_LINK_PREFIX.$id;
    $d = new DOMDocument();
    if (! @$d->loadHTMLfile($url)) return [];
    $xp = new DOMXpath($d);
    $meta['title'] = explode(' | ', $xp->query('//title')->item(0)->nodeValue)[0];
    $meta['kyu'] = +explode(
        ' ',
        $xp->query("//span[contains(text(), 'kyu')]")->item(0)->nodeValue
    )[0];
    return $meta;
}

$updateCache = false;
foreach ($files as $lang => $list) {
    foreach ($list as $file) {
        $code = file_get_contents($file);
        $kata = [];
        preg_match(LINE_LINK_MATCH, $code, $m);
        if (! $m) continue;
        $id = $m[2];
        if (isset($katas[$id])) continue;
        $updateCache = true;
        
        $kata['url'] = $m[1];
        $kata['files'][$lang] = $file;
        ksort($kata['files']);
        $kata = array_merge($kata, getMeta($id));
        
        $katas[$id] = $kata;
    }
}

if ($updateCache) {
    file_put_contents(
        KATA_CACHE_FILE,
        json_encode($katas, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES)
    );
}

$byKyu = [];
foreach ($katas as $kata) {
    $byKyu[$kata['kyu']][] = $kata;
}
// sort by Kyu
ksort($byKyu);

foreach ($byKyu as $kyu => $kata) {
    usort($byKyu[$kyu], function($k0, $k1) {
        return ($k0['title'] == $k1['title']) ?
            0 : (($k0['title'] < $k1['title']) ? -1 : 1);
    });
}

foreach ($byKyu as $kyu => $katas) {
    echo "## $kyu Kyu\n";
    foreach ($katas as $kata) {
        echo "### [{$kata['title']}]({$kata['url']})\n";
        echo "|||\n";
        echo "|-|-|\n";
        foreach ($kata['files'] as $lang => $file) {
            echo "|$lang : |[$file](".GH_FILE_LINK_MASTER_BR."$file)|\n";
        }
        echo "\n";
    }
}
