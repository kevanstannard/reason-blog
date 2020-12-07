type post = {
  key: string,
  date: Js.Date.t,
  title: string,
  body: string,
}

exception NodeError(string)

let blogTitle = "ReasonML Notes"
let postsDir = "./content/posts"
let templatesDir = "./content/templates"
let docsDir = "./docs"

let readFile = path => {
  Js.Promise.make((~resolve, ~reject) => {
    let onRead = (. error, data) => {
      let errorOpt = Js.Nullable.toOption(error)
      let dataOpt = Js.Nullable.toOption(data)
      switch (errorOpt, dataOpt) {
      | (Some(_error), _) => reject(. NodeError("Error reading post file"))
      | (_, Some(data)) => resolve(. data)
      | (None, None) => reject(. NodeError("Reading post file returned null"))
      }
    }
    Fs.readFile(path, "utf-8", onRead)
  })
}

let createDocsDir = () =>
  if !Fs.existsSync(docsDir) {
    Fs.mkdirSync(docsDir) |> ignore
  }

let cleanDocsDir = () => Js.Promise.make((~resolve, ~reject) => {
    Rimraf.rimraf(.docsDir, error => {
      let errorOpt = Js.Nullable.toOption(error)
      switch errorOpt {
      | Some(_error) => reject(. NodeError("Error deleting the docs directory"))
      | None =>
        createDocsDir()
        resolve(. ignore)
      }
    })
  })

let pathToKey = path => Path.basename(~path, ~ext=".md", ())

let formatDate = (date: Js.Date.t) => DateFns.format(date, "yyyy-MM-dd")

let writePost = (key: string, html: string) => {
  Js.Promise.make((~resolve, ~reject) => {
    let fileName = docsDir ++ "/" ++ key ++ ".html"
    Fs.writeFile(fileName, html, error => {
      let errorOpt = Js.Nullable.toOption(error)
      switch errorOpt {
      | Some(_error) => reject(. NodeError("Error writing post file"))
      | None => resolve(. key)
      }
    })
  })
}

let applyTemplate = (template: string, post: post) =>
  Mustache.render(template, {"title": post.title, "body": post.body})

let writePosts = posts => {
  let postTemplatePath = templatesDir ++ "/post.html"
  readFile(postTemplatePath) |> Js.Promise.then_(template => {
    posts |> Array.map((post: post) => {
      let data = {
        "blogTitle": blogTitle,
        "date": formatDate(post.date),
        "title": post.title,
        "body": post.body,
      }
      let html = Mustache.render(template, data, ())
      writePost(post.key, html)
    }) |> Js.Promise.all |> Js.Promise.then_(_ => Js.Promise.resolve())
  })
}

let getValue = (attributes, key) => {
  let value = Js.Dict.get(attributes, key)
  switch value {
  | Some(text) => text
  | None => ""
  }
}

type attributes = {
  title: option<string>,
  date: option<Js.Date.t>,
}

let readPost = path => {
  readFile(path) |> Js.Promise.then_((data: string) => {
    let key = pathToKey(path)
    let fmData = FrontMatter.fm(data)
    let attributes: attributes = fmData.attributes
    let body = Markdown.markdownIt.render(. fmData.body)
    switch (attributes.title, attributes.date) {
    | (Some(title), Some(date)) => {
        let post = {key: key, date: date, title: title, body: body}
        Js.Promise.resolve(post)
      }
    | _ => Js.Promise.reject(Failure("Invalid post attributes: " ++ path))
    }
  })
}

let sortByDateDescending = (postA: post, postB: post) => {
  let a = postA.date
  let b = postB.date
  if a == b {
    0
  } else if a < b {
    1
  } else {
    -1
  }
}

let sortPosts = (posts: array<post>): array<post> => {
  posts |> Array.stable_sort(sortByDateDescending)
  posts
}

let readPosts = (paths: array<string>) =>
  paths
  |> Array.map(readPost)
  |> Js.Promise.all
  |> Js.Promise.then_(posts => {posts |> sortPosts |> Js.Promise.resolve})

let readPostPaths = () => Js.Promise.make((~resolve, ~reject) => {
    Glob.glob(postsDir ++ "/*.md", (error, paths) => {
      let errorOpt = Js.Nullable.toOption(error)
      switch errorOpt {
      | Some(_error) => reject(. NodeError("Error reading post paths"))
      | None => resolve(. paths)
      }
    })
  })

let writeIndexFile = (html: string) => {
  Js.Promise.make((~resolve, ~reject) => {
    let fileName = docsDir ++ "/index.html"
    Fs.writeFile(fileName, html, error => {
      let errorOpt = Js.Nullable.toOption(error)
      switch errorOpt {
      | Some(_error) => reject(. NodeError("Error writing index file"))
      | None => resolve(. ignore)
      }
    })
  })
}

let writeIndex = (posts: array<post>) => {
  let indexTemplatePath = templatesDir ++ "/index.html"
  readFile(indexTemplatePath) |> Js.Promise.then_(template => {
    let postsData = posts |> Array.map(post =>
      {
        "path": post.key ++ ".html",
        "date": formatDate(post.date),
        "title": post.title,
      }
    )
    let html = Mustache.render(template, {"blogTitle": blogTitle, "posts": postsData}, ())
    writeIndexFile(html)
  }) |> Js.Promise.then_(_ => Js.Promise.resolve())
}

readPostPaths() |> Js.Promise.then_(readPosts) |> Js.Promise.then_(posts => {
  cleanDocsDir() |> Js.Promise.then_(_ => {
    Js.Promise.all([writeIndex(posts), writePosts(posts)])
  })
}) |> Js.Promise.catch(error => {
  Js.log(error)
  Js.Promise.resolve([])
})
