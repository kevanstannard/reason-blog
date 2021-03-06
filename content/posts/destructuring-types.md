---
title: De-structuring ReScript type data (using pattern matching)
date: 2020-12-12 05:40:09
---

```
ReScript version: bs-platform@8.4.2
```

Suppose we have the following type:

```res
type person = Person(string, int);
```

We can use this type as follows:

```res
let joe = Person("Joe", 23);
let jim = Person("Jim", 31);
```

When we have variables like this, we can use pattern matching to extract the values:

```res
let Person(name1, age1) = joe;
let Person(name2, age2) = jim;

Js.log2(name1, age1);
Js.log2(name2, age2);

// "Joe" 23
// "Jim" 31
```
