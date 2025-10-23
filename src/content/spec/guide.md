# 指南

本指南会介绍如何编写以及编辑歌曲条目
## 快速导航
1. [文件结构](#文件结构)
2. [md文件头部各字段值介绍](#各字段值介绍)
3. [YAML中歌词定义](#歌词定义)
4. [歌词中宏定义](#宏定义)
5. [歌词注音格式](#歌词注音格式)
6. [歌词样式标注](#样式标注)
7. [正文部分格式](#正文部分格式)

## 文件结构
    src/
    ├── content/
    │   ├── songs/
    │   │   ├── savior-of-song.md
    │   │   ├── yes_bang_dream.md
    │   │   └──...
    │   └──...
    ├── pages/
    ├── package.json
    └── ...

其中`songs`目录即为存放歌词文件的目录
:::note
约定将空格或特殊符号用`-`或`_`代替(或者直接删掉)
:::

## md文件-frontmatter区
frontmatter区是由一对`---`围起的`YAML`区域  
此处记载了歌曲的一些基本信息，通常不属于正文范畴  
下面以歌曲[yes_bang_dream.md](/songs/yes_bang_dream/)为例介绍其结构
```markdown
---
title: Yes! BanG_Dream!
published: 2016-02-24
tags: [Poppin'Party, Original, nikokara, lyrics]
category: Poppin'Party
band: Poppin'Party
lyrics: |
  <define <ppp> = <span style="color:#FF3377; text-shadow:0 0 0px #000;">>
  <ppp>
  さあ、{飛|と}びだそう！{明日|あした}のドア ノックして
  {解|と}き{放|はな}つ {無|む}{敵|てき}で{最|さい}{強|きょう}のうた
  ......
  </ppp>
---


```
### 各字段值介绍
`title`: 歌曲的标题  
`published`: 歌曲的发布日期(若未发布，只有Game ver则写游戏中发布日期)
`tags`: 歌曲相关标签，根据需要填写，建议为:
> 乐队(只写本企划)+歌曲类型+(nikokara/no nikokara)+(lyrics/no lyrics)+(联动类型，如holo)+其他  
> (nikokara/no nikokara) 用于筛选是否已添加nikokara的ktv歌词  
> (lyrics/no lyrics) 用于筛选是否已添加静态歌词  

`category`: 乐队分类，若不是常规分类请写`others`  
`band`: 乐队名称，一般按游戏显示为准   
`lyrics`: 歌词，其格式将在下文中介绍 

### 歌词部分格式
歌词作为歌曲信息的一部分，会自动插入到页面底部
#### 歌词定义
```yaml
lyrics: | <--这个竖线是yaml多行字符串的标记，从下一行开始为yaml字符串的值
在这里填写歌词内容
像这样直接换行即可，不需要手动加<br/>
```
#### 宏定义
```
//宏定义语法示例1
<define <ppp> = <span style="color:#FF3377; text-shadow:0 0 0px #000;">>
//宏定义语法示例2
<define show <ksm> = <span style="color:#FF5522;">>
```
- 这段宏定义会把歌词正文的所有`<ppp>`和`</ppp>`    
分别替换为`<span style="color:#FF3377; text-shadow:0 0 0px #000;">`和`</span>`
- 若`define`后有`show`标记，则还会自动在歌词顶部添加分词指示

:::tip
可以在开头进行无实际替换的宏定义来添加分词指示
:::
#### 歌词注音格式
```
さあ、{飛|と}びだそう！{明日|あした}のドア ノックして
```
- 无注音的字符直接输入即可，有注音的字段使用`{被注音字段|注音}`给出
- 此种注音格式可以方便地由`RhythmicaLyrics`工程文件中通过简单的正则替换得出  
  打开已注音的文件->削除除了汉字之外的所有假名->进入テキスト编集モード->复制进文本编辑器  
  把满足下面正则的字符串替换为空(即删除)
```
＋+|\[\d+(?:\|\d{2}:\d{2}:\d{2,})?\]|\[\d{2}:\d{2}:\d{2,}\]
```
#### 样式标注
```html
//若先前定义了宏样式，可以直接使用宏
<ksm>さあ、{飛|と}びだそう！{明日|あした}のドア ノックして</ksm>

//也可以直接使用HTML标签进行样式标注
<span style="color:#FF3377;">Yes！ BanG_Dream！</span>
```
:::tip
标签内部总内容的前导空格/换行符和尾部空格/换行符均会在解析时被移除  
因此若有换行需求，请在标签外部或者内容之间使用换行
::: 
```html
//下面为了便于理解把换行符用"↵"显式标明，实际使用时不用书写
//这两种写法等价
<saaya>{煌|きら}めいた{八月|はちがつ}の“if”</saaya>
<saaya> 
    {煌|きら}めいた{八月|はちがつ}の“if” 
</saaya>
//但“八月”前的换行符、和</ksm><saaya>之间的换行符仍生效
<ksm> ↵                 //不生效
「……出会ってたのかな？」 ↵ //不生效
</ksm> ↵                //生效
 ↵                      //生效
<saaya> ↵               //不生效
 ↵                      //不生效
{煌|きら}めいた ↵         //生效
{八月|はちがつ}の“if” ↵   //不生效
</saaya>
```
   
## 正文部分格式
正文一般拿来放歌曲别名和B站上nikokara视频的链接，链接格式如下，可以放多个
```html
<summary>
    <a href="https://www.bilibili.com/video/BV16dtVz8EXU/">
        [Bilibili]【纯K投屏/自用】Yes! BanG Dream! - Poppin'Party
    </a>
</summary>
```