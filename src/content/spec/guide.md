# 指南

本指南会介绍如何编写以及编辑歌曲条目

:::tip
添加歌曲后请前往about.md删除相应歌曲记录
:::
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
约定将空格或无法作为文件名的符号用`_`代替(或者直接删掉)
:::

## md文件-frontmatter区
frontmatter区是由一对`---`围起的`YAML`区域  
此处记载了歌曲的一些基本信息，通常不属于正文范畴  
下面以歌曲[yes_bang_dream.md](/songs/yes_bang_dream/)为例介绍其结构
```markdown
---
title: Yes! BanG_Dream!
published: 2016-02-24
tags: [Poppin'Party, Original, Nicokara, Lyrics]
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
`published`: 歌曲的发布日期(若为限定公开则填公开日期，若未发布，只有Short ver则写游戏中发布日期)   
`tags`: 歌曲相关标签，根据需要填写，建议为:
> 乐队(只写本企划)+歌曲类型+(Nicokara)+(Lyrics)+(Short Ver)+(联动类型，如holo)+其他  
* (Nicokara) 用于筛选是否已添加Nicokara的ktv歌词  
* (Lyrics) 用于筛选是否已添加静态歌词  
* (Short Ver) 如果邦版只能找到游戏版本，无全曲，则添加此标记

:::important
注意，如果翻唱曲由于无BanG Dream!版本的nicokara视频而使用原曲的视频  
在标签中不要写`Nicokara`而要写`O-Nicokara`
:::
:::important
请尽量和原有的tag保持一致  
注意`Hello, Happy World!`等带逗号的tag请使用双引号包裹，否则会变为`Hello`和`Happy World!`两个tag
:::

`category`: 乐队分类，若不是常规分类请写`Others`  
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
   
## 正文部分格式
正文一般拿来放歌曲别名和B站上(ニコカラ)Nicokara视频的链接，链接格式如下，可以放多个
若需要进行备注，也可以加入正文中，参考[Hacking to the Gate](/songs/hacking_to_the_gate/)
```html
<summary>
    <a href="https://www.bilibili.com/video/BV16dtVz8EXU/">
        [Bilibili]【纯K投屏/自用】Yes! BanG Dream! - Poppin'Party
    </a>
</summary>
```
:::important
注意，如果翻唱曲由于无BanG Dream!版本的nicokara视频而使用原曲的视频  
请悬挂下面的模板，并在标签中不要写`Nicokara`而要写`O-Nicokara`
:::
```markdown
:::note
BanG Dream!版本暂无卡拉ok视频，此处使用其他版本视频
:::
```