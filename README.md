# KAG Script Syntax Tree Generator

[![Build Status](https://travis-ci.org/komsomolskinari/kstg.svg?branch=master)](https://travis-ci.org/komsomolskinari/kstg)
[![Coverage Status](https://coveralls.io/repos/github/komsomolskinari/kstg/badge.svg?branch=master)](https://coveralls.io/github/komsomolskinari/kstg?branch=master)
[![npm version](https://badge.fury.io/js/kstg.svg)](https://badge.fury.io/js/kstg)

本项目是对[tenshin.js](https://github.com/komsomolskinari/tenshin.js)中KAG脚本解析器的重写。项目计划用于替换原有解析器并作为其他Kirikiri相关语言解析器的基础。

产生的AST采用类ESTree格式，以便于将来滥用babel或者ASTExplorer或者其他什么工具进行处理。

相对于前身，最主要的改变是不再假设KAG脚本是逐行解析的，符合语言的原始设计。
