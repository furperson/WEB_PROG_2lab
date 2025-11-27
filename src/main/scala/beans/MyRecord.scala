package beans

import scala.beans.BeanProperty
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class MyRecord(
                     @BeanProperty isHit: Boolean,
                     @BeanProperty X: Int,
                     @BeanProperty Y: Float,
                     @BeanProperty R: Int,
                     @BeanProperty OnTime: String,
                     @BeanProperty WorkTime: Long
                   )

object MyRecord {
  implicit val decoder: Decoder[MyRecord] = deriveDecoder[MyRecord]
  implicit val encoder: Encoder[MyRecord] = deriveEncoder[MyRecord]
}