import { t as cn } from "./utils-DY7wRfUn.js";
import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Clock, Disc3, Loader2, Music2, Pause, Play, Radio, RotateCcw, Trash2, Volume2, VolumeX } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
const radioStations = [
	{
		id: "france-inter",
		name: "France Inter",
		streamUrl: "https://icecast.radiofrance.fr/franceinter-midfi.mp3",
		logoUrl: "https://fr.wikipedia.org/wiki/France_Inter#/media/Fichier:France_Inter_logo_2021.svg",
		color: "#e2001a",
		country: "FR",
		website: "https://www.radiofrance.fr/franceinter"
	},
	{
		id: "rtl",
		name: "RTL",
		streamUrl: "https://icecast.rtl.fr/rtl-1-44-128",
		logoUrl: "data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200 200\"%3E%3Crect fill=\"%23ff6b00\" width=\"200\" height=\"200\"/%3E%3Ctext x=\"50%25\" y=\"50%25\" dominant-baseline=\"middle\" text-anchor=\"middle\" font-family=\"Arial Black\" font-size=\"80\" fill=\"white\" font-weight=\"bold\"%3ERTL%3C/text%3E%3C/svg%3E",
		color: "#ff6b00",
		country: "FR",
		website: "https://www.rtl.fr"
	},
	{
		id: "ici-besancon",
		name: "Ici Besançon",
		streamUrl: "https://icecast.radiofrance.fr/fbbesancon-midfi.mp3",
		logoUrl: "https://media.tunedradios.com/w_250,h_250,q_50/static/radio/3394/logo/970ec2b7f7852e329971c212196cfcbb.webp",
		color: "#0055a4",
		country: "FR",
		website: "https://www.radiofrance.fr/francebleu/besancon"
	},
	{
		id: "france-musique",
		name: "France Musique",
		streamUrl: "https://icecast.radiofrance.fr/francemusique-midfi.mp3",
		logoUrl: "https://www.radiofrance.fr/s3/cruiser-production/2021/10/4c79241a-547e-4c39-af5e-d3d0ac2d4e67/200x200_francemusique.png",
		color: "#9b59b6",
		country: "FR",
		website: "https://www.radiofrance.fr/francemusique"
	},
	{
		id: "france-culture",
		name: "France Culture",
		streamUrl: "https://icecast.radiofrance.fr/franceculture-midfi.mp3",
		logoUrl: "https://www.radiofrance.fr/s3/cruiser-production/2021/10/268c6dca-8acd-4e67-b0e8-6d2d615ad374/200x200_franceculture.png",
		color: "#8e44ad",
		country: "FR",
		website: "https://www.radiofrance.fr/franceculture"
	},
	{
		id: "rts",
		name: "RTS",
		streamUrl: "https://stream.srg-ssr.ch/m/la-1ere/mp3_128",
		logoUrl: "data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200 200\"%3E%3Crect fill=\"%23d32f2f\" width=\"200\" height=\"200\"/%3E%3Ctext x=\"50%25\" y=\"50%25\" dominant-baseline=\"middle\" text-anchor=\"middle\" font-family=\"Arial Black\" font-size=\"70\" fill=\"white\" font-weight=\"bold\"%3ERTS%3C/text%3E%3C/svg%3E",
		color: "#d32f2f",
		country: "CH",
		website: "https://www.rts.ch/audio/la-1ere/"
	},
	{
		id: "fip",
		name: "FIP",
		streamUrl: "https://icecast.radiofrance.fr/fip-midfi.mp3",
		logoUrl: "https://www.radiofrance.fr/s3/cruiser-production/2021/10/5f7f8ecb-4e1f-4b93-9061-0d0d0a1e7e7e/200x200_fip.png",
		color: "#ff1493",
		country: "FR",
		website: "https://www.radiofrance.fr/fip"
	},
	{
		id: "grrif",
		name: "GRRIF",
		streamUrl: "https://grrif.ice.infomaniak.ch/grrif-128.aac",
		logoUrl: "data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200 200\"%3E%3Crect fill=\"%2300bcd4\" width=\"200\" height=\"200\"/%3E%3Ctext x=\"50%25\" y=\"50%25\" dominant-baseline=\"middle\" text-anchor=\"middle\" font-family=\"Arial Black\" font-size=\"50\" fill=\"white\" font-weight=\"bold\"%3EGRRIF%3C/text%3E%3C/svg%3E",
		color: "#00bcd4",
		country: "CH",
		website: "https://www.grrif.ch"
	},
	{
		id: "canal-b",
		name: "Canal B",
		streamUrl: "https://stream.levillage.org/canalb",
		logoUrl: "data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200 200\"%3E%3Crect fill=\"%234caf50\" width=\"200\" height=\"200\"/%3E%3Ctext x=\"50%25\" y=\"45%25\" dominant-baseline=\"middle\" text-anchor=\"middle\" font-family=\"Arial Black\" font-size=\"50\" fill=\"white\" font-weight=\"bold\"%3ECanal%3C/text%3E%3Ctext x=\"50%25\" y=\"65%25\" dominant-baseline=\"middle\" text-anchor=\"middle\" font-family=\"Arial Black\" font-size=\"80\" fill=\"white\" font-weight=\"bold\"%3EB%3C/text%3E%3C/svg%3E",
		color: "#4caf50",
		country: "FR",
		website: "https://www.canalb.fr"
	},
	{
		id: "wfmu",
		name: "WFMU",
		streamUrl: "https://stream0.wfmu.org/freeform-128k",
		logoUrl: "data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200 200\"%3E%3Crect fill=\"%23ffc107\" width=\"200\" height=\"200\"/%3E%3Ctext x=\"50%25\" y=\"50%25\" dominant-baseline=\"middle\" text-anchor=\"middle\" font-family=\"Arial Black\" font-size=\"50\" fill=\"%23000\" font-weight=\"bold\"%3EWFMU%3C/text%3E%3C/svg%3E",
		color: "#ffc107",
		country: "US",
		website: "https://wfmu.org"
	}
];
function StationButton({ station, isActive, isPlaying, onClick }) {
	const [imageError, setImageError] = useState(false);
	return /* @__PURE__ */ jsxs(motion.button, {
		onClick,
		className: "relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 backdrop-blur-sm transition-all hover:scale-105 active:scale-95",
		style: {
			boxShadow: isActive ? `0 0 30px ${station.color}40, 0 0 60px ${station.color}20` : "0 4px 20px rgba(0,0,0,0.3)",
			border: isActive ? `2px solid ${station.color}` : "2px solid transparent"
		},
		whileHover: { y: -4 },
		whileTap: { scale: .95 },
		children: [
			isActive && /* @__PURE__ */ jsx(motion.div, {
				className: "absolute inset-0 opacity-20",
				style: { background: `radial-gradient(circle at center, ${station.color}, transparent)` },
				animate: {
					scale: [
						1,
						1.2,
						1
					],
					opacity: [
						.2,
						.3,
						.2
					]
				},
				transition: {
					duration: 2,
					repeat: Infinity,
					ease: "easeInOut"
				}
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative z-10 flex flex-col items-center gap-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-white/10 p-3 backdrop-blur-sm",
					style: { backgroundColor: isActive ? `${station.color}20` : void 0 },
					children: [isActive && isPlaying && /* @__PURE__ */ jsx(motion.div, {
						className: "absolute inset-0 rounded-xl",
						style: { border: `2px solid ${station.color}` },
						animate: {
							scale: [
								1,
								1.1,
								1
							],
							opacity: [
								.5,
								.8,
								.5
							]
						},
						transition: {
							duration: 1.5,
							repeat: Infinity,
							ease: "easeInOut"
						}
					}), !imageError ? /* @__PURE__ */ jsx("img", {
						src: station.logoUrl,
						alt: station.name,
						className: "h-full w-full object-contain",
						crossOrigin: "anonymous",
						onError: () => {
							console.warn(`Failed to load logo for ${station.name}`);
							setImageError(true);
						}
					}) : /* @__PURE__ */ jsx(Radio, { className: "h-12 w-12 text-white" })]
				}), /* @__PURE__ */ jsxs("div", {
					className: "text-center",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "font-display text-xl font-bold uppercase tracking-wider",
						style: {
							color: isActive ? station.color : "#ffffff",
							textShadow: isActive ? `0 0 20px ${station.color}80` : "none"
						},
						children: station.name
					}), isActive && isPlaying && /* @__PURE__ */ jsxs(motion.div, {
						className: "mt-2 flex items-center justify-center gap-1",
						initial: {
							opacity: 0,
							y: -10
						},
						animate: {
							opacity: 1,
							y: 0
						},
						children: [/* @__PURE__ */ jsx(Radio, {
							className: "h-3 w-3",
							style: { color: station.color }
						}), /* @__PURE__ */ jsx("span", {
							className: "text-xs font-medium uppercase tracking-wide",
							style: { color: station.color },
							children: "En direct"
						})]
					})]
				})]
			}),
			isActive && /* @__PURE__ */ jsx(motion.div, {
				className: "absolute right-0 top-0 h-16 w-16",
				style: { background: `radial-gradient(circle at top right, ${station.color}40, transparent)` },
				initial: { opacity: 0 },
				animate: { opacity: 1 }
			})
		]
	});
}
function StationGrid({ currentStation, isPlaying, onStationSelect }) {
	return /* @__PURE__ */ jsx("div", {
		className: "w-full",
		children: /* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
			children: radioStations.map((station) => /* @__PURE__ */ jsx(StationButton, {
				station,
				isActive: currentStation?.id === station.id,
				isPlaying,
				onClick: () => onStationSelect(station)
			}, station.id))
		})
	});
}
function MetadataDisplay({ metadata, isLoading, stationColor }) {
	if (isLoading && !metadata) return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-2 text-sm text-slate-400",
		children: [/* @__PURE__ */ jsx(motion.div, {
			animate: { rotate: 360 },
			transition: {
				duration: 2,
				repeat: Infinity,
				ease: "linear"
			},
			children: /* @__PURE__ */ jsx(Disc3, { className: "h-4 w-4" })
		}), /* @__PURE__ */ jsx("span", { children: "Chargement des informations..." })]
	});
	if (!metadata || !metadata.title && !metadata.show) return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-2 text-sm text-slate-400",
		children: [/* @__PURE__ */ jsx(Music2, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "En direct" })]
	});
	const hasValidTrack = metadata.title && metadata.title !== "En direct";
	return /* @__PURE__ */ jsx(AnimatePresence, {
		mode: "wait",
		children: /* @__PURE__ */ jsxs(motion.div, {
			initial: {
				opacity: 0,
				y: 10
			},
			animate: {
				opacity: 1,
				y: 0
			},
			exit: {
				opacity: 0,
				y: -10
			},
			transition: { duration: .3 },
			className: "flex flex-col gap-1",
			children: [
				metadata.show && /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("div", {
						className: "h-1 w-1 rounded-full",
						style: { backgroundColor: stationColor }
					}), /* @__PURE__ */ jsx("span", {
						className: "text-xs font-medium uppercase tracking-wide text-slate-400",
						children: metadata.show
					})]
				}),
				hasValidTrack && /* @__PURE__ */ jsxs("div", {
					className: "flex items-start gap-3",
					children: [metadata.coverArt && /* @__PURE__ */ jsx(motion.img, {
						src: metadata.coverArt,
						alt: "Cover",
						className: "h-12 w-12 rounded-lg object-cover shadow-lg",
						initial: {
							scale: .8,
							opacity: 0
						},
						animate: {
							scale: 1,
							opacity: 1
						},
						transition: { duration: .3 },
						onError: (e) => {
							const target = e.target;
							target.style.display = "none";
						}
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex-1 min-w-0",
						children: [metadata.title && /* @__PURE__ */ jsx("p", {
							className: "truncate font-semibold text-white",
							style: { textShadow: `0 0 10px ${stationColor}40` },
							children: metadata.title
						}), metadata.artist && /* @__PURE__ */ jsx("p", {
							className: "truncate text-sm text-slate-300",
							children: metadata.artist
						})]
					})]
				}),
				!hasValidTrack && metadata.show && /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 text-sm text-slate-300",
					children: [/* @__PURE__ */ jsx(Music2, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "En direct" })]
				})
			]
		}, `${metadata.title}-${metadata.artist}-${metadata.show}`)
	});
}
function Slider({ className, defaultValue, value, min = 0, max = 100,...props }) {
	const _values = React.useMemo(() => Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max], [
		value,
		defaultValue,
		min,
		max
	]);
	return /* @__PURE__ */ jsxs(SliderPrimitive.Root, {
		"data-slot": "slider",
		defaultValue,
		value,
		min,
		max,
		className: cn("relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col", className),
		...props,
		children: [/* @__PURE__ */ jsx(SliderPrimitive.Track, {
			"data-slot": "slider-track",
			className: cn("bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"),
			children: /* @__PURE__ */ jsx(SliderPrimitive.Range, {
				"data-slot": "slider-range",
				className: cn("bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full")
			})
		}), Array.from({ length: _values.length }, (_, index) => /* @__PURE__ */ jsx(SliderPrimitive.Thumb, {
			"data-slot": "slider-thumb",
			className: "border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
		}, index))]
	});
}
function ControlBar({ station, playbackState, volume, isMuted, metadata, metadataLoading, error, onPlayPause, onVolumeChange, onToggleMute, onRetry }) {
	const isPlaying = playbackState === "playing";
	const isLoading = playbackState === "loading";
	const hasError = playbackState === "error";
	return /* @__PURE__ */ jsxs(motion.div, {
		className: "fixed bottom-0 left-0 right-0 z-50 border-t border-slate-700/50 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-900/95 backdrop-blur-xl",
		initial: { y: 100 },
		animate: { y: 0 },
		transition: {
			type: "spring",
			damping: 25,
			stiffness: 200
		},
		children: [
			hasError && error && /* @__PURE__ */ jsxs(motion.div, {
				className: "flex items-center justify-between gap-3 border-b border-red-500/20 bg-red-950/30 px-4 py-2 text-sm",
				initial: {
					opacity: 0,
					height: 0
				},
				animate: {
					opacity: 1,
					height: "auto"
				},
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 text-red-400",
					children: [/* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: error })]
				}), /* @__PURE__ */ jsxs("button", {
					onClick: onRetry,
					className: "flex items-center gap-1 rounded-lg bg-red-500/20 px-3 py-1 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/30",
					children: [/* @__PURE__ */ jsx(RotateCcw, { className: "h-3 w-3" }), "Réessayer"]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mx-auto max-w-7xl px-4 py-4",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-6",
					children: [/* @__PURE__ */ jsx("div", {
						className: "flex-1 min-w-0",
						children: station ? /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/5 p-2 backdrop-blur-sm",
								style: { boxShadow: isPlaying ? `0 0 20px ${station.color}40` : "none" },
								children: [/* @__PURE__ */ jsx("img", {
									src: station.logoUrl,
									alt: station.name,
									className: "h-full w-full object-contain"
								}), isPlaying && /* @__PURE__ */ jsx(motion.div, {
									className: "absolute inset-0 rounded-xl",
									style: { border: `2px solid ${station.color}` },
									animate: { opacity: [
										.3,
										.6,
										.3
									] },
									transition: {
										duration: 2,
										repeat: Infinity,
										ease: "easeInOut"
									}
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ jsx("h2", {
									className: "mb-1 font-display text-lg font-bold uppercase tracking-wide",
									style: {
										color: station.color,
										textShadow: `0 0 15px ${station.color}60`
									},
									children: station.name
								}), /* @__PURE__ */ jsx(MetadataDisplay, {
									metadata,
									isLoading: metadataLoading,
									stationColor: station.color
								})]
							})]
						}) : /* @__PURE__ */ jsxs("div", {
							className: "text-slate-400",
							children: [/* @__PURE__ */ jsx("p", {
								className: "font-display text-lg font-bold uppercase tracking-wide",
								children: "Sélectionnez une station"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-sm",
								children: "Choisissez une radio pour commencer"
							})]
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ jsxs(motion.button, {
							onClick: onPlayPause,
							disabled: !station || isLoading,
							className: "relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-800 shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
							style: { boxShadow: station && isPlaying ? `0 0 30px ${station.color}60, 0 4px 20px rgba(0,0,0,0.4)` : "0 4px 20px rgba(0,0,0,0.4)" },
							whileHover: { scale: 1.05 },
							whileTap: { scale: .95 },
							children: [isLoading ? /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-white" }) : isPlaying ? /* @__PURE__ */ jsx(Pause, {
								className: "h-6 w-6",
								style: { color: station?.color || "#ffffff" }
							}) : /* @__PURE__ */ jsx(Play, {
								className: "h-6 w-6",
								style: { color: station?.color || "#ffffff" }
							}), isPlaying && station && /* @__PURE__ */ jsx(motion.div, {
								className: "absolute inset-0 rounded-full",
								style: { border: `2px solid ${station.color}` },
								animate: {
									scale: [
										1,
										1.2,
										1
									],
									opacity: [
										.5,
										0,
										.5
									]
								},
								transition: {
									duration: 2,
									repeat: Infinity,
									ease: "easeInOut"
								}
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "hidden sm:flex items-center gap-3",
							children: [/* @__PURE__ */ jsx("button", {
								onClick: onToggleMute,
								className: "text-slate-400 transition-colors hover:text-white",
								children: isMuted ? /* @__PURE__ */ jsx(VolumeX, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Volume2, { className: "h-5 w-5" })
							}), /* @__PURE__ */ jsx(Slider, {
								value: [isMuted ? 0 : volume * 100],
								onValueChange: (values) => onVolumeChange(values[0] / 100),
								max: 100,
								step: 1,
								className: "w-24"
							})]
						})]
					})]
				})
			}),
			station && isPlaying && /* @__PURE__ */ jsx("div", {
				className: "absolute bottom-0 left-0 right-0 h-1",
				style: {
					background: `linear-gradient(to right, transparent, ${station.color}, transparent)`,
					boxShadow: `0 0 20px ${station.color}80`
				}
			})
		]
	});
}
function ListeningHistory({ history, onClear }) {
	if (history.length === 0) return /* @__PURE__ */ jsxs("div", {
		className: "rounded-2xl border border-slate-800/50 bg-slate-900/30 p-8 text-center backdrop-blur-sm",
		children: [
			/* @__PURE__ */ jsx(Music2, { className: "mx-auto mb-3 h-12 w-12 text-slate-600" }),
			/* @__PURE__ */ jsx("p", {
				className: "text-slate-400",
				children: "Aucun historique d'écoute"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-slate-500",
				children: "Les titres que vous écoutez apparaîtront ici"
			})
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-2xl border border-slate-800/50 bg-slate-900/30 backdrop-blur-sm",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between border-b border-slate-800/50 p-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ jsx(Clock, { className: "h-5 w-5 text-slate-400" }),
					/* @__PURE__ */ jsx("h3", {
						className: "font-display text-lg font-bold uppercase tracking-wide text-white",
						children: "Historique d'écoute"
					}),
					/* @__PURE__ */ jsx("span", {
						className: "rounded-full bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-300",
						children: history.length
					})
				]
			}), /* @__PURE__ */ jsxs("button", {
				onClick: onClear,
				className: "flex items-center gap-1 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20",
				children: [/* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" }), "Effacer"]
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "max-h-96 overflow-y-auto",
			children: /* @__PURE__ */ jsx(AnimatePresence, {
				mode: "popLayout",
				children: history.map((entry, index) => /* @__PURE__ */ jsx(motion.div, {
					initial: {
						opacity: 0,
						x: -20
					},
					animate: {
						opacity: 1,
						x: 0
					},
					exit: {
						opacity: 0,
						x: 20
					},
					transition: { delay: index * .05 },
					className: "border-b border-slate-800/30 p-4 transition-colors hover:bg-slate-800/20",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-start gap-3",
						children: [entry.metadata.coverArt ? /* @__PURE__ */ jsx("img", {
							src: entry.metadata.coverArt,
							alt: "Cover",
							className: "h-12 w-12 flex-shrink-0 rounded-lg object-cover shadow-md"
						}) : /* @__PURE__ */ jsx("div", {
							className: "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg",
							style: { backgroundColor: `${entry.stationColor}20` },
							children: /* @__PURE__ */ jsx(Music2, {
								className: "h-6 w-6",
								style: { color: entry.stationColor }
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "truncate font-semibold text-white",
									children: entry.metadata.title
								}),
								entry.metadata.artist && /* @__PURE__ */ jsx("p", {
									className: "truncate text-sm text-slate-300",
									children: entry.metadata.artist
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-1 flex items-center gap-2 text-xs text-slate-500",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "font-medium",
											style: { color: entry.stationColor },
											children: entry.stationName
										}),
										/* @__PURE__ */ jsx("span", { children: "•" }),
										/* @__PURE__ */ jsx("span", { children: formatDistanceToNow(entry.timestamp, {
											addSuffix: true,
											locale: fr
										}) })
									]
								})
							]
						})]
					})
				}, entry.id))
			})
		})]
	});
}
function useAudioPlayer() {
	const audioRef = useRef(null);
	const [currentStation, setCurrentStation] = useState(null);
	const [playbackState, setPlaybackState] = useState("idle");
	const [volume, setVolumeState] = useState(() => {
		const saved = localStorage.getItem("radio-volume");
		return saved ? parseFloat(saved) : .7;
	});
	const [isMuted, setIsMuted] = useState(false);
	const [error, setError] = useState(null);
	useEffect(() => {
		const audio = new Audio();
		audio.preload = "none";
		audio.volume = volume;
		audioRef.current = audio;
		if ("mediaSession" in navigator) {
			navigator.mediaSession.setActionHandler("play", () => {
				audio.play();
			});
			navigator.mediaSession.setActionHandler("pause", () => {
				audio.pause();
			});
			navigator.mediaSession.setActionHandler("stop", () => {
				audio.pause();
				audio.currentTime = 0;
			});
		}
		return () => {
			audio.pause();
			audio.src = "";
		};
	}, []);
	useEffect(() => {
		if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
	}, [volume, isMuted]);
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;
		const handleCanPlay = () => {
			setPlaybackState("playing");
			setError(null);
		};
		const handlePlaying = () => {
			setPlaybackState("playing");
			setError(null);
		};
		const handlePause = () => {
			if (playbackState !== "loading") setPlaybackState("paused");
		};
		const handleWaiting = () => {
			setPlaybackState("loading");
		};
		const handleError = (e) => {
			console.error("Audio error:", e);
			const audioError = e.target.error;
			let errorMessage = "Erreur de lecture";
			if (audioError) switch (audioError.code) {
				case MediaError.MEDIA_ERR_ABORTED:
					errorMessage = "Lecture interrompue";
					break;
				case MediaError.MEDIA_ERR_NETWORK:
					errorMessage = "Erreur réseau - Vérifiez votre connexion";
					break;
				case MediaError.MEDIA_ERR_DECODE:
					errorMessage = "Erreur de décodage du flux";
					break;
				case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
					errorMessage = "Format de flux non supporté";
					break;
			}
			setPlaybackState("error");
			setError(errorMessage);
		};
		const handleStalled = () => {
			setError("Connexion lente - Mise en mémoire tampon...");
		};
		audio.addEventListener("canplay", handleCanPlay);
		audio.addEventListener("playing", handlePlaying);
		audio.addEventListener("pause", handlePause);
		audio.addEventListener("waiting", handleWaiting);
		audio.addEventListener("error", handleError);
		audio.addEventListener("stalled", handleStalled);
		return () => {
			audio.removeEventListener("canplay", handleCanPlay);
			audio.removeEventListener("playing", handlePlaying);
			audio.removeEventListener("pause", handlePause);
			audio.removeEventListener("waiting", handleWaiting);
			audio.removeEventListener("error", handleError);
			audio.removeEventListener("stalled", handleStalled);
		};
	}, [playbackState]);
	const play = useCallback(async (station) => {
		const audio = audioRef.current;
		if (!audio) return;
		try {
			setPlaybackState("loading");
			setError(null);
			setCurrentStation(station);
			audio.pause();
			audio.src = "";
			audio.src = station.streamUrl;
			audio.load();
			if ("mediaSession" in navigator) navigator.mediaSession.metadata = new MediaMetadata({
				title: station.name,
				artist: "Radio en direct",
				artwork: [{
					src: station.logoUrl,
					sizes: "512x512",
					type: "image/png"
				}]
			});
			await audio.play();
			localStorage.setItem("last-station", station.id);
		} catch (err) {
			console.error("Play error:", err);
			setPlaybackState("error");
			setError("Impossible de lire cette station - Vérifiez votre connexion");
		}
	}, []);
	return {
		currentStation,
		playbackState,
		volume,
		isMuted,
		error,
		play,
		pause: useCallback(() => {
			const audio = audioRef.current;
			if (audio && playbackState === "playing") {
				audio.pause();
				setPlaybackState("paused");
			}
		}, [playbackState]),
		resume: useCallback(async () => {
			const audio = audioRef.current;
			if (audio && playbackState === "paused") try {
				await audio.play();
				setPlaybackState("playing");
			} catch (err) {
				console.error("Resume error:", err);
				setPlaybackState("error");
				setError("Impossible de reprendre la lecture");
			}
		}, [playbackState]),
		stop: useCallback(() => {
			const audio = audioRef.current;
			if (audio) {
				audio.pause();
				audio.src = "";
				setPlaybackState("idle");
				setCurrentStation(null);
				setError(null);
			}
		}, []),
		setVolume: useCallback((newVolume) => {
			const clampedVolume = Math.max(0, Math.min(1, newVolume));
			setVolumeState(clampedVolume);
			localStorage.setItem("radio-volume", clampedVolume.toString());
		}, []),
		toggleMute: useCallback(() => {
			setIsMuted((prev) => !prev);
		}, []),
		retry: useCallback(async () => {
			if (currentStation) await play(currentStation);
		}, [currentStation, play])
	};
}
async function fetchRadioFranceMetadata(stationId) {
	try {
		const response = await fetch(`https://www.radiofrance.fr/api/v2.1/stations/${stationId}/live`, {
			mode: "cors",
			headers: { Accept: "application/json" }
		});
		if (!response.ok) {
			console.warn(`Radio France API returned ${response.status} for ${stationId}`);
			return null;
		}
		const now = (await response.json())?.now;
		if (!now) return {
			title: "En direct",
			artist: "",
			show: ""
		};
		return {
			title: now?.secondLine || now?.song?.title || now?.firstLine || "En direct",
			artist: now?.firstLine || now?.song?.interpreters?.[0] || "",
			show: now?.show?.title || "",
			coverArt: now?.song?.cover || now?.show?.visual || void 0,
			startTime: now?.startTime
		};
	} catch (error) {
		console.error("Radio France metadata error:", error);
		return {
			title: "En direct",
			artist: "",
			show: ""
		};
	}
}
async function fetchStationMetadata(stationId) {
	const radioFranceStations = {
		"france-inter": "franceinter",
		"france-musique": "francemusique",
		"france-culture": "franceculture",
		fip: "fip",
		"ici-besancon": "fbbesancon"
	};
	if (radioFranceStations[stationId]) return fetchRadioFranceMetadata(radioFranceStations[stationId]);
	return {
		title: "En direct",
		artist: "",
		show: ""
	};
}
function createMetadataPoller(stationId, onUpdate, intervalMs = 15e3) {
	let intervalId = null;
	const poll = async () => {
		onUpdate(await fetchStationMetadata(stationId));
	};
	poll();
	intervalId = setInterval(poll, intervalMs);
	return () => {
		if (intervalId) clearInterval(intervalId);
	};
}
var HISTORY_KEY = "radio-listening-history";
var MAX_HISTORY_ITEMS = 10;
function getListeningHistory() {
	try {
		const stored = localStorage.getItem(HISTORY_KEY);
		if (!stored) return [];
		return JSON.parse(stored);
	} catch (error) {
		console.error("Failed to load listening history:", error);
		return [];
	}
}
function addToHistory(stationId, stationName, stationColor, metadata) {
	if (!metadata.title || metadata.title === "En direct") return;
	const history = getListeningHistory();
	const newEntry = {
		id: `${stationId}-${Date.now()}`,
		stationId,
		stationName,
		stationColor,
		metadata,
		timestamp: Date.now()
	};
	const lastEntry = history[0];
	if (lastEntry && lastEntry.stationId === stationId && lastEntry.metadata.title === metadata.title && lastEntry.metadata.artist === metadata.artist) return;
	const updatedHistory = [newEntry, ...history].slice(0, MAX_HISTORY_ITEMS);
	try {
		localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
	} catch (error) {
		console.error("Failed to save listening history:", error);
	}
}
function clearHistory() {
	try {
		localStorage.removeItem(HISTORY_KEY);
	} catch (error) {
		console.error("Failed to clear listening history:", error);
	}
}
function useRadioMetadata(station, isPlaying) {
	const [metadata, setMetadata] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	useEffect(() => {
		if (!station || !isPlaying) {
			setMetadata(null);
			return;
		}
		setIsLoading(true);
		return createMetadataPoller(station.id, (newMetadata) => {
			setMetadata(newMetadata);
			setIsLoading(false);
			if (newMetadata && newMetadata.title && newMetadata.title !== "En direct") addToHistory(station.id, station.name, station.color, newMetadata);
			if (newMetadata && "mediaSession" in navigator) navigator.mediaSession.metadata = new MediaMetadata({
				title: newMetadata.title || station.name,
				artist: newMetadata.artist || newMetadata.show || "En direct",
				album: station.name,
				artwork: newMetadata.coverArt ? [{
					src: newMetadata.coverArt,
					sizes: "512x512",
					type: "image/jpeg"
				}] : [{
					src: station.logoUrl,
					sizes: "512x512",
					type: "image/png"
				}]
			});
		}, 15e3);
	}, [station, isPlaying]);
	return {
		metadata,
		isLoading
	};
}
function registerServiceWorker() {
	if ("serviceWorker" in navigator) window.addEventListener("load", () => {
		navigator.serviceWorker.register("/sw.js").then((registration) => {
			console.log("Service Worker registered:", registration);
			setInterval(() => {
				registration.update();
			}, 6e4);
			registration.addEventListener("updatefound", () => {
				const newWorker = registration.installing;
				if (newWorker) newWorker.addEventListener("statechange", () => {
					if (newWorker.state === "installed" && navigator.serviceWorker.controller) console.log("New service worker available");
				});
			});
		}).catch((error) => {
			console.error("Service Worker registration failed:", error);
		});
	});
}
function RadioApp() {
	useEffect(() => {
		registerServiceWorker();
	}, []);
	const [history, setHistory] = useState(() => getListeningHistory());
	const { currentStation, playbackState, volume, isMuted, error, play, pause, resume, setVolume, toggleMute, retry } = useAudioPlayer();
	const { metadata, isLoading: metadataLoading } = useRadioMetadata(currentStation, playbackState === "playing");
	useEffect(() => {
		const interval = setInterval(() => {
			setHistory(getListeningHistory());
		}, 5e3);
		return () => clearInterval(interval);
	}, []);
	const handleStationSelect = async (station) => {
		if (currentStation?.id === station.id) if (playbackState === "playing") pause();
		else if (playbackState === "paused") resume();
		else await play(station);
		else await play(station);
	};
	const handlePlayPause = () => {
		if (!currentStation) return;
		if (playbackState === "playing") pause();
		else if (playbackState === "paused") resume();
		else play(currentStation);
	};
	const handleClearHistory = () => {
		clearHistory();
		setHistory([]);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 opacity-10",
				children: /* @__PURE__ */ jsx("div", {
					className: "absolute inset-0",
					style: {
						backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
						backgroundSize: "40px 40px"
					}
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none",
				style: { backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }
			}),
			/* @__PURE__ */ jsx("main", {
				className: "relative z-10 pb-32 pt-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "mx-auto max-w-7xl space-y-8 px-4",
					children: [/* @__PURE__ */ jsx(StationGrid, {
						currentStation,
						isPlaying: playbackState === "playing",
						onStationSelect: handleStationSelect
					}), /* @__PURE__ */ jsx(ListeningHistory, {
						history,
						onClear: handleClearHistory
					})]
				})
			}),
			/* @__PURE__ */ jsx(ControlBar, {
				station: currentStation,
				playbackState,
				volume,
				isMuted,
				metadata,
				metadataLoading,
				error,
				onPlayPause: handlePlayPause,
				onVolumeChange: setVolume,
				onToggleMute: toggleMute,
				onRetry: retry
			})
		]
	});
}
export { RadioApp as component };

//# sourceMappingURL=_public-KQCLTocC.js.map