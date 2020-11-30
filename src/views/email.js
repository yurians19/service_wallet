module.exports = (url,token,sessionID) => {
    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
      </head>
      <body>
        <div class="row">
          <div class="col-md-4 mx-auto">
            <div class="card mt-4 text-center">
              <div class="card-header">
                <h1 class="h4">
                  Click to confirm your payment
                </h1>
              </div>
              <div class="card-body">
                <form action="${url}" method="POST">
                  <div class="form-group">
                    <input type="hidden" class="form-control" name="token" value="${token}">
                  </div>
                  <div class="form-group">
                    <input type="hidden" class="form-control" name="sessionID" value="${sessionID}">
                  </div>
                  <button class="btn btn-primary btn-block">
                    Confirm Pay 
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>`
}