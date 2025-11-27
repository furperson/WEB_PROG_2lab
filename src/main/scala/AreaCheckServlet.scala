package Top;

import java.io._
import jakarta.servlet._
import jakarta.servlet.annotation.WebServlet
import jakarta.servlet.http._;

//@WebServlet(name = "AreaCheckServlet", urlPatterns = Array("/check"))
class AreaCheckServlet extends HttpServlet {
  override def doGet(
                      req: HttpServletRequest,
                      res: HttpServletResponse
                    ): Unit = {
    res.setContentType("text/html")
    res.setCharacterEncoding("UTF-8")
    res.getWriter.write("""<h1>Hello, world!</h1>""")
  }
}
