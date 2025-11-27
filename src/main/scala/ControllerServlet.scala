package Top

import jakarta.servlet._
import jakarta.servlet.http._
import jakarta.servlet.annotation.WebServlet

class ControllerServlet extends HttpServlet {

  private val areaCheckServlet = new AreaCheckServlet()

  override def doGet(req: HttpServletRequest, res: HttpServletResponse): Unit = {
    processRequest(req, res)
  }

  override def doPost(req: HttpServletRequest, res: HttpServletResponse): Unit = {
    processRequest(req, res)
  }

  private def processRequest(req: HttpServletRequest, res: HttpServletResponse): Unit = {
    try {
      val path = req.getRequestURI.substring(req.getContextPath.length)
      val action = Option(req.getParameter("action")).getOrElse("")


      // Проверка наличия параметров для проверки области
      val hasCoordinates = Option(req.getParameter("X")).isDefined &&
        Option(req.getParameter("Y")).isDefined &&
        Option(req.getParameter("R")).isDefined

      if (hasCoordinates && action == "check") {
        areaCheckServlet.service(req, res)
      } else {
        req.getRequestDispatcher("/jsp/index.jsp").forward(req, res)
      }

    } catch {
      case e: Exception =>
        req.setAttribute("error", s"Произошла ошибка: ${e.getMessage}")
        req.getRequestDispatcher("/jsp/error.jsp").forward(req, res)
    }
  }
}