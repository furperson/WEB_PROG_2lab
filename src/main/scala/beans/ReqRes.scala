package beans

import scala.beans.BeanProperty
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class ReqRes(
                   @BeanProperty X: Int,
                   @BeanProperty Y: Float,
                   @BeanProperty R: Int
                 )

object ReqRes {
  implicit val decoder: Decoder[ReqRes] = deriveDecoder[ReqRes]
  implicit val encoder: Encoder[ReqRes] = deriveEncoder[ReqRes]
}