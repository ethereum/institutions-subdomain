---
title: "Actualización Fusaka: Ethereum se escala de forma segura"
datePublished: 2025-12-09
---

***Estado***: Activa y estable en la red principal
***Fecha***: 3 de diciembre de 2025

* La actualización Fusaka de Ethereum se ejecutó con éxito manteniendo un 100% de tiempo de actividad, ya que todos los equipos de clientes independientes implementaron las especificaciones de protocolo de Osaka (ejecución) y Fulu (consenso).
* Fusaka, la segunda actualización de red de 2025, ofrece un cambio estructural en la capacidad de la red Ethereum sin comprometer la seguridad ni la descentralización.
* Fusaka resuelve barreras críticas para la adopción: experiencia de usuario, limitaciones de capacidad de datos, complejidad de custodia y costos.

*Obtenga más información sobre las [Propuestas de Mejora de Ethereum (EIP) implementadas en Fusaka aquí](https://forkcast.org/upgrade/fusaka), y sobre las [EIP en consideración para Glamsterdam, la próxima actualización de red, aquí](https://forkcast.org/upgrade/glamsterdam).*

## Fusaka: Mejoras técnicas clave

<br /> 

**Ampliación de la disponibilidad de datos**: *Un aumento de 8 veces en la capacidad de datos de liquidación reduce significativamente los costos de transacción de L2*

* Anteriormente, se requería que los nodos descargaran todos los blobs (objetos de datos de liquidación) para verificarlos.
* Con el Muestreo de Disponibilidad de Datos por Pares (PeerDAS, [EIP-7594](https://eips.ethereum.org/EIPS/eip-7594)), los nodos ahora muestrean pequeños fragmentos de datos para verificar su integridad.
* Este cambio introduce efectivamente la verificación de datos distribuida, aumentando el rendimiento de la disponibilidad de datos hasta 8 veces sin aumentar la carga de hardware en los nodos individuales.
* La reducción masiva de la sobrecarga de liquidación de datos para las capas 2 se traduce en tarifas bajas y estables para los usuarios y aplicaciones empresariales de alto volumen.

<br /> 

**Incorporación más fácil y rápida**: *El soporte universal para estándares criptográficos comunes habilita la autenticación móvil segura como "Passkeys" (FaceID/TouchID)*

* Ethereum ahora incluye un estándar nativo para la curva elíptica secp256r1 (P-256) ([EIP-7951](https://eips.ethereum.org/EIPS/eip-7951)), la criptografía compatible con NIST utilizada por los HSM tradicionales, Apple Secure Enclave, Android Keystore y WebAuthn.
* El soporte permite que las cuentas inteligentes y las billeteras verifiquen firmas directamente desde los HSM y los enclaves seguros de los móviles, eliminando el "middleware" personalizado o las complejas soluciones de gestión de claves requeridas anteriormente para cerrar la brecha entre la criptografía nativa de Ethereum (curva k1) y el hardware estándar de grado bancario.
* Las billeteras ahora pueden agregar de manera eficiente soporte para que los usuarios se autentiquen a través de biometría como FaceID, habilitando una experiencia de aplicación nativa para móviles convencional mientras se mantiene la seguridad.

<br />

**Ampliación de la capacidad de transacciones**: *Permite que la red procese aproximadamente un 33% más de transacciones en la Capa 1 de inmediato, con un mecanismo para aumentar la capacidad de forma segura y gradual*

* La red ha aumentado el límite por bloque en el esfuerzo computacional en un ~33% (de ~45M a 60M de gas), permitiendo que la red principal liquide un volumen significativamente mayor de transacciones por bloque.
* Parámetros de datos configurables: las bifurcaciones de solo parámetros de blobs (BPO) ([EIP-7892](https://eips.ethereum.org/EIPS/eip-7892)) permiten que la red ajuste la capacidad de datos a través de actualizaciones de configuración estándar para mayor agilidad fuera de las grandes actualizaciones de protocolo.

<br />

**Eficiencia operativa**: *Garantizar la estabilidad de la infraestructura a medida que la red se escala y mejorar las confirmaciones de transacciones*

* Los datos anticipados sobre el próximo proponente de bloque de la red ([EIP-7917](https://eips.ethereum.org/EIPS/eip-7917)) significan que las aplicaciones pueden integrar 'preconfirmaciones basadas', reduciendo la latencia de las preconfirmaciones de transacciones para proporcionar una experiencia de usuario de pago y liquidación de 'sensación instantánea'.
* Las actualizaciones en la expiración del historial ([EIP-7642](https://eips.ethereum.org/EIPS/eip-7642)) y los requisitos de los nodos hacen que las sincronizaciones completas sean más rápidas y utilicen menos GB de almacenamiento por nodo, evitando el crecimiento excesivo de la infraestructura mientras se mantienen las operaciones de la infraestructura del validador doméstico sostenibles y rentables.


## Perspectiva futura: Glamsterdam (2026)

<br /> 

Con la capa de datos escalada a través de Fusaka, la próxima actualización programada, Glamsterdam, se centrará en la ejecución y neutralidad de la Capa 1.

Objetivo principal: Internalización de la producción de bloques ([Separación Proponente-Constructor Consagrada (ePBS)](https://eips.ethereum.org/EIPS/eip-7732))

* ePBS elimina la dependencia de relevos de terceros (middleware) para facilitar la producción de bloques, eliminando una capa de contraparte y descentralizando aún más la red.
* Glamsterdam solidificará aún más a Ethereum como una capa de liquidación neutral donde la inclusión de transacciones está garantizada por el propio protocolo, no por terceros.

Obtenga más información sobre las [EIP que se están considerando para Glamsterdam aquí](https://forkcast.org/upgrade/glamsterdam).